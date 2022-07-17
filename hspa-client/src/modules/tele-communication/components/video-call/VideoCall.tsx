import { FC, useEffect, useRef } from "react";
import { useSetState } from "react-use";
import { useSocket } from "socket.io-react-hook";

import log from "lib/log";
import {
  HSPA_WEB_SOCKET_URL_HEROKU,
  rtcPeerConnectionConfig,
} from "shared/constants";
import { useMessage } from "modules/tele-communication/services/message";
import { v4 as uuid } from "uuid";
import Button from "shared/common-ui/atoms/Button";
import { useLocation } from "react-router-dom";
import { VideoCallData } from "modules/tele-communication/types";

interface Props {}

interface State {
  cameraMode: "user" | "environment";
  existingTracks: any[];
  remoteStreams: any[];
}

const VideoCall: FC<Props> = ({}) => {
  const location = useLocation();
  const videoCallData = location.state as VideoCallData;
  const { clientId = "mohit@hpr.abdm", receiverIds = ["airesh@abha"], isPrimaryDoctor = true } =
    videoCallData || {};

  const [state, setState] = useSetState<State>({
    cameraMode: "user",
    existingTracks: [],
    remoteStreams: [],
  });

  const connection = useRef({});
  const localStream = useRef();

  useEffect(() => {
    getLocalWebCamFeed();
  }, []);

  const { socket, connected } = useSocket(HSPA_WEB_SOCKET_URL_HEROKU, {
    transports: ["websocket"],
    query: {
      userId: clientId,
    },
  });

  useEffect(() => {
    if (connected && localStream.current) {
      createRTCPeerConnection();
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
      handleOffer(data);
    }
    if (type === "CANDIDATE") {
      handleCandidate(data);
    }
    if (type === "ANSWER") {
      handleAnswer(data);
    }
  };

  useEffect(() => {
    socket.on("message", onSocketMessage);
  }, [socket]);

  const createRTCPeerConnection = () => {
    if ((connection.current as any).addTrack) {
      return;
    }
    connection.current = new RTCPeerConnection(rtcPeerConnectionConfig);

    if (
      !localStream.current ||
      (localStream.current as any)?.getTracks()?.length === 0
    ) {
      return;
    }

    // Add both video and audio tracks to the connection
    for (const track of (localStream.current as any)?.getTracks()) {
      log("Sending Stream.");
      state.existingTracks.push(
        (connection.current as any).addTrack(track, localStream.current)
      );
    }

    // This event handles displaying remote video and audio feed from the other peer
    (connection.current as any).ontrack = (event: any) => {
      log("Recieved Stream.", event);
      setState((oldState) => {
        const previousRemoteStreams = oldState.remoteStreams;
        const existInList = previousRemoteStreams.find(
          (stream) => stream.id === event.streams[0].id
        );
        if (!existInList) {
          (document.getElementById(
            `remoteVideo-${previousRemoteStreams.length + 1}`
          ) as any)!.srcObject = event.streams[0];
          previousRemoteStreams.push(event.streams[0]);
          return { ...oldState, remoteStreams: previousRemoteStreams };
        }
        return oldState;
      });
    };

    // This event sends the ice candidates generated from Stun or Turn server to the Receiver over web socket
    (connection.current as any).onicecandidate = (event: any) => {
      console.log("On ice candidate called");
      if (event.candidate) {
        log("Sending Ice Candidate - " + event.candidate.candidate);

        sendMessage({
          senderId: clientId,
          receiverId: receiverIds,
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
          log("Web RTC Peer Connection Connected.");
          (document.getElementById("answerButton") as any).disabled = true;
          (document.getElementById("sendOfferButton") as any).disabled = true;
          (document.getElementById("hangUpButton") as any).disabled = false;
          (document.getElementById("sendMessageButton") as any).disabled =
            false;
          break;
        case "disconnected":
          log(
            "Web RTC Peer Connection Disconnected. Please reload the page to reconnect."
          );
          //   disableAllButtons();
          break;
        case "failed":
          log(
            "Web RTC Peer Connection Failed. Please reload the page to reconnect."
          );
          console.log(event);
          //   disableAllButtons();
          break;
        case "closed":
          log(
            "Web RTC Peer Connection Failed. Please reload the page to reconnect."
          );
          //   disableAllButtons();
          break;
        default:
          break;
      }
    };

    log("Web RTC Peer Connection Created.");
    // document.getElementById("sendOfferButton").disabled = false;
  };

  const handleCandidate = (candidate: any) => {
    // Avoid accepting the ice candidate if this is a message created by the current peer
    log("Adding Ice Candidate - " + candidate.candidate);
    (connection.current as any).addIceCandidate(new RTCIceCandidate(candidate));
  };

  /**
   * Accepts Offer received from the Caller
   */
  const handleOffer = (offer: any) => {
    log("Recieved The Offer.");
    (connection.current as any).setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    //   document.getElementById("answerButton").disabled = false;
    //   document.getElementById("sendOfferButton").disabled = true;
  };

  /**
   * Accepts Answer received from the Receiver
   */
  const handleAnswer = (answer: any) => {
    // Avoid accepting the Answer if this is a message created by the current peer
    log("Recieved The Answer");
    (connection.current as any).setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  /**
   * Creates and sends the Offer to the Receiver
   * Creates a Data channel for exchanging text messages
   * This function is invoked by the Caller
   */
  const createAndSendOffer = () => {
    // Create Offer
    (connection.current as any).createOffer().then(
      (offer: any) => {
        log("Sent The Offer.");

        sendMessage({
          senderId: clientId,
          receiverId: receiverIds,
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "OFFER",
              data: offer,
            }),
          },
        });

        // Set Offer for negotiation
        (connection.current as any).setLocalDescription(offer);
      },
      (error: any) => {
        log("Error when creating an offer.");
        console.error(error);
      }
    );
  };

  /**
   * Creates and sends the Answer to the Caller
   * This function is invoked by the Receiver
   */
  const createAndSendAnswer = () => {
    // Create Answer
    (connection.current as any).createAnswer().then(
      (answer: any) => {
        console.log("Sent The Answer.");

        // Set Answer for negotiation
        (connection.current as any).setLocalDescription(answer);

        // Send Answer to other peer
        sendMessage({
          senderId: clientId,
          receiverId: receiverIds,
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "ANSWER",
              data: answer,
            }),
          },
        });
      },
      (error: any) => {
        console.log("Error when creating an answer.");
        console.error(error);
      }
    );
  };

  const {
    mutation: { mutateAsync: sendMessage },
  } = useMessage();

  const initiateSocketAndPeerConnection = (stream: any) => {
    (document.getElementById("localVideo") as any)!.srcObject = stream;
    localStream.current = stream;
  };

  const getLocalWebCamFeed = async (onSuccess?: (stream: any) => any) => {
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
      await navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream: any) {
          initiateSocketAndPeerConnection(stream);
          if (onSuccess && typeof onSuccess === "function") {
            onSuccess(stream);
          }
        })
        .catch(function (e: any) {
          log(e.name + ": " + e.message);
        });
    } else {
      navigator.getWebcam(
        { audio: true, video: true },
        function (stream: any) {
          initiateSocketAndPeerConnection(stream);
          if (onSuccess && typeof onSuccess === "function") {
            onSuccess(stream);
          }
        },
        function () {
          log("Web cam is not accessible.");
        }
      );
    }
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
    <div>
      <p>VideoCall</p>
      <video
        id="localVideo"
        onClick={switchMobileCamera}
        muted
        playsInline
        autoPlay
      />
      <video
        id="remoteVideo-1"
        onClick={switchMobileCamera}
        muted
        playsInline
        autoPlay
      />
      <video
        id="remoteVideo-2"
        onClick={switchMobileCamera}
        muted
        playsInline
        autoPlay
      />
      <div className="">
        {!!isPrimaryDoctor ? (
          <Button id="sendOfferButton" onClick={createAndSendOffer}>
            Call
          </Button>
        ) : (
          <Button id="sendOfferButton" onClick={createAndSendAnswer}>
            Answer
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
