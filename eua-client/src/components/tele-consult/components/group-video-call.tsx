import { FC, useEffect, useRef } from "react";
import { useSetState } from "react-use";

import {
  HSPA_WEB_SOCKET_URL,
  rtcPeerConnectionConfig,
} from "../../../utils/constants";
import { useMessage } from "../services/message";
import { useSocket } from "socket.io-react-hook";
import { v4 as uuid } from "uuid";
import { useLocation } from "react-router-dom";
import { type GroupVideoCallData } from "../types";
import createAndSendAnswer from "../services/create-and-send-answer";

interface Props {}

interface State {
  cameraMode: "user" | "environment";
  remoteStreams: any[];
  existingTracks: any[];
}

const GroupVideoCall: FC<Props> = () => {
  const location = useLocation();
  const videoCallData = location.state as GroupVideoCallData;
  const {
    clientId = "airesh@abha",
    primaryDoctorId = "mohit@hpr.abdm",
    secondaryDoctorId = "sriram@hpr.abdm",
  } = videoCallData || {};
  const [state, setState] = useSetState<State>({
    cameraMode: "user",
    remoteStreams: [],
    existingTracks: [],
  });

  const primaryDoctorConnection = useRef({});
  const secondaryDoctorConnection = useRef({});
  const localStream = useRef();

  useEffect(() => {
    getLocalWebCamFeed();
  }, []);

  const { socket, connected } = useSocket(HSPA_WEB_SOCKET_URL, {
    transports: ["websocket"],
    query: {
      userId: clientId,
    },
  });

  useEffect(() => {
    if (connected && localStream.current) {
      createRTCPeerConnection(primaryDoctorConnection, 1);
      createRTCPeerConnection(secondaryDoctorConnection, 2);
    }
  }, [connected, localStream.current]);

  const onSocketMessage = (message: string) => {
    if (!message || message.includes("Connected as")) {
      return;
    }

    const parsedMessage = JSON.parse(message);
    const { senderId, content } = parsedMessage;

    if (senderId === clientId) {
      return;
    }

    const { value } = content;
    const parsedContentValue = JSON.parse(value);
    const { type, data } = parsedContentValue;

    if (type === "OFFER") {
      handleOffer({ offer: data, senderId });
    }
    if (type === "CANDIDATE") {
      handleCandidate({ candidate: data, senderId });
    }
  };

  useEffect(() => {
    socket.on("message", onSocketMessage);
  }, [socket]);

  function createRTCPeerConnection(connection: any, index: number) {
    if ((connection.current as any).addTrack) {
      return;
    }
    connection.current = new RTCPeerConnection(rtcPeerConnectionConfig);

    // Add both video and audio tracks to the connection
    for (const track of (localStream.current as any).getTracks()) {
      console.log("Sending Stream.");
      state.existingTracks.push(
        (connection.current as any).addTrack(track, localStream.current)
      );
    }

    // This event handles displaying remote video and audio feed from the other peer
    (connection.current as any).ontrack = (event: any) => {
      console.log("Recieved Stream.", event.streams[0]);
      setState((oldState) => {
        const previousRemoteStreams = oldState.remoteStreams;
        const existInList = previousRemoteStreams.find(
          (stream) => stream.id === event.streams[0].id
        );
        if (!existInList) {
          (document.getElementById(`remoteVideo-${index}`) as any)!.srcObject =
            event.streams[0];
          previousRemoteStreams.push(event.streams[0]);
          return {
            ...oldState,
            remoteStreams: previousRemoteStreams,
          };
        }
        return oldState;
      });
    };

    // This event handles the received data channel from the other peer
    (connection.current as any).ondatachannel = function (event: any) {
      console.log("Recieved a DataChannel.");
    };

    // This event sends the ice candidates generated from Stun or Turn server to the Receiver over web socket
    (connection.current as any).onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log("Sending Ice Candidate - " + event.candidate.candidate);

        sendMessage({
          senderId: clientId,
          receiverId: [index === 1 ? primaryDoctorId : secondaryDoctorId],
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "CANDIDATE",
              data: event.candidate,
            }),
          },
        });
      }
    };

    // This event logs messages and handles button state according to WebRTC connection state changes
    (connection.current as any).onconnectionstatechange = function (
      event: any
    ) {
      switch ((connection.current as any).connectionState) {
        case "connected":
          console.log("Web RTC Peer Connection Connected.");
          (document.getElementById("answerButton") as any).disabled = true;
          (document.getElementById("sendOfferButton") as any).disabled = true;
          (document.getElementById("hangUpButton") as any).disabled = false;
          (document.getElementById("sendMessageButton") as any).disabled =
            false;
          break;
        case "disconnected":
          console.log(
            "Web RTC Peer Connection Disconnected. Please reload the page to reconnect."
          );
          //   disableAllButtons();
          break;
        case "failed":
          console.log(
            "Web RTC Peer Connection Failed. Please reload the page to reconnect."
          );
          console.log(event);
          //   disableAllButtons();
          break;
        case "closed":
          console.log(
            "Web RTC Peer Connection Failed. Please reload the page to reconnect."
          );
          //   disableAllButtons();
          break;
        default:
          break;
      }
    };

    console.log("Web RTC Peer Connection Created.");
    // document.getElementById("sendOfferButton").disabled = false;
  }

  const {
    mutation: { mutateAsync: sendMessage },
  } = useMessage();

  const initiateSocketAndPeerConnection = (stream: any) => {
    (document.getElementById("localVideo") as any)!.srcObject = stream;
    localStream.current = stream;
    setState({ existingTracks: [stream] });
  };

  const getLocalWebCamFeed = () => {
    const constraints = {
      audio: true,
      video: {
        facingMode: state.cameraMode,
        width: { ideal: 4096 },
        height: { ideal: 2160 },
      },
    };

    const navigator = window.navigator as any;

    navigator.getWebcam =
      navigator.getUserMedia ||
      navigator.webKitGetUserMedia ||
      navigator.moxGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream: any) {
          initiateSocketAndPeerConnection(stream);
        })
        .catch(function (e: any) {
          console.log(e.name + ": " + e.message);
        });
    } else {
      navigator.getWebcam(
        { audio: true, video: true },
        function (stream: any) {
          initiateSocketAndPeerConnection(stream);
        },
        function () {
          console.log("Web cam is not accessible.");
        }
      );
    }
  };

  /**
   * Creates and sends the Answer to the Caller
   * This function is invoked by the Receiver
   */
  const createAndSendAnswerPrimaryDoctor = () => {
    createAndSendAnswer(primaryDoctorConnection, clientId, [primaryDoctorId])
  };
  const createAndSendAnswerSecondaryDoctor = () => {
    createAndSendAnswer(secondaryDoctorConnection, clientId, [secondaryDoctorId])
  }

  const handleCandidate = ({ candidate, senderId }: { candidate: any; senderId: string }) => {
    if (senderId === primaryDoctorId) {
        handleCandidatePrimaryDoctor(candidate);
    } else {
        handleCandidateSecondaryDoctor(candidate);
    }
  };
  const handleCandidatePrimaryDoctor = (candidate: any) => {
    console.log("Adding Ice Candidate - " + candidate.candidate);
    (primaryDoctorConnection.current as any).addIceCandidate(new RTCIceCandidate(candidate));
  };
  const handleCandidateSecondaryDoctor = (candidate: any) => {
    console.log("Adding Ice Candidate - " + candidate.candidate);
    (secondaryDoctorConnection.current as any).addIceCandidate(new RTCIceCandidate(candidate));
  };

  /**
   * Accepts Offer received from the Caller
   */
  const handleOffer = ({ offer, senderId }: { offer: any; senderId: string }) => {
    if (senderId === primaryDoctorId) {
        handleOfferPrimaryDoctor(offer);
    } else {
        handleOfferSecondaryDoctor(offer);
    }
  };
  const handleOfferPrimaryDoctor = (offer: any) => {
    console.log("Recieved The Offer.");
    (primaryDoctorConnection.current as any).setRemoteDescription(
      new RTCSessionDescription(offer)
    );
  };
  const handleOfferSecondaryDoctor = (offer: any) => {
    console.log("Recieved The Offer.");
    (secondaryDoctorConnection.current as any).setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    createAndSendAnswerSecondaryDoctor();
  };

  function switchMobileCamera() {
    if (state.cameraMode === "user") {
      setState({ cameraMode: "environment" });
    } else {
      setState({ cameraMode: "user" });
    }

    getLocalWebCamFeed();
  }

  return (
    <>
      <p>GroupVideoCall</p>
      <div>
        <video
          width="100%"
          id="localVideo"
          onClick={switchMobileCamera}
          muted
          playsInline
          autoPlay
        />
        <video
          width="100%"
          id="remoteVideo-1"
          onClick={switchMobileCamera}
          muted
          playsInline
          autoPlay
        />
        <video
          width="100%"
          id="remoteVideo-2"
          onClick={switchMobileCamera}
          muted
          playsInline
          autoPlay
        />
      </div>
      <div>
        <button id="sendOfferButton" onClick={createAndSendAnswerPrimaryDoctor}>
          Answer
        </button>
      </div>
    </>
  );
};

export default GroupVideoCall;
