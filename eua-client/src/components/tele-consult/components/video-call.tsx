import { FC, useEffect, useRef } from "react";
import { useSetState } from "react-use";

import {
  HSPA_WEB_SOCKET_URL_NGROK,
  rtcPeerConnectionConfig,
} from "../../../utils/constants";
import { useMessage } from "../services/message";
import { useSocket } from "socket.io-react-hook";
import { v4 as uuid } from "uuid";

interface Props {
  clientId?: string;
}

interface State {
  cameraMode: "user" | "environment";
  localStream: any;
  existingTracks: any[];
}

const VideoCall: FC<Props> = ({ clientId = "airesh@abha" }) => {
  const [state, setState] = useSetState<State>({
    cameraMode: "user",
    localStream: null,
    existingTracks: [],
  });

  const connection = useRef({});

  useEffect(() => {
    getLocalWebCamFeed();
  }, []);

  const { socket, connected } = useSocket(HSPA_WEB_SOCKET_URL_NGROK, {
    transports: ["websocket"],
    query: {
      userId: clientId,
    },
  });

  useEffect(() => {
    if (connected) {
      createRTCPeerConnection();
    }
  }, [connected]);

  const onSocketMessage = (message: string) => {
    if (!message || message.includes("Connected as")) return;
    const parsedMessage = JSON.parse(message);
    const { senderId, content } = parsedMessage;
    if (senderId === clientId) return;
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
    console.log(parsedContentValue, "***** parsed content value");
  };

  useEffect(() => {
    socket.on("message", onSocketMessage);
  }, [socket]);

  function createRTCPeerConnection() {
    if ((connection.current as any).addTrack) {
      return;
    }
    connection.current = new RTCPeerConnection(rtcPeerConnectionConfig);

    // Add both video and audio tracks to the connection
    for (const track of state.localStream.getTracks()) {
      console.log("Sending Stream.");
      state.existingTracks.push(
        (connection.current as any).addTrack(track, state.localStream)
      );
    }

    // This event handles displaying remote video and audio feed from the other peer
    (connection.current as any).ontrack = (event: any) => {
      console.log("Recieved Stream.", event.streams[0]);
      (document.getElementById("remoteVideo") as any)!.srcObject =
        event.streams[0];
    };

    // This event handles the received data channel from the other peer
    (connection.current as any).ondatachannel = function (event: any) {
      console.log("Recieved a DataChannel.");
      //   channel = event.channel;
      //   setChannelEvents(channel);
      //   document.getElementById("sendMessageButton").disabled = false;
    };

    // This event sends the ice candidates generated from Stun or Turn server to the Receiver over web socket
    (connection.current as any).onicecandidate = (event: any) => {
      if (event.candidate) {
        console.log("Sending Ice Candidate - " + event.candidate.candidate);

        sendMessage({
          senderId: clientId,
          receiverId: ["mohit@hpr.abdm"],
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

  const sendMessageHelper = async () => {
    const response = await sendMessage({
      senderId: "airesh@abha",
      receiverId: ["mohit@hpr.abdm"],
      timestamp: new Date(),
      content: {
        id: "CONNECT",
        value: "connect",
      },
    });
    console.log(response);
  };

  const initiateSocketAndPeerConnection = (stream: any) => {
    (document.getElementById("localVideo") as any)!.srcObject = stream;
    setState({ localStream: stream });
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
          receiverId: ["mohit@hpr.abdm"],
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

  const handleCandidate = (candidate: any) => {
    // Avoid accepting the ice candidate if this is a message created by the current peer
    console.log("Adding Ice Candidate - " + candidate.candidate);
    (connection.current as any).addIceCandidate(new RTCIceCandidate(candidate));
  };

  /**
   * Accepts Offer received from the Caller
   */
  const handleOffer = (offer: any) => {
    console.log("Recieved The Offer.");
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
    console.log("Recieved The Answer");
    (connection.current as any).setRemoteDescription(
      new RTCSessionDescription(answer)
    );
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
      <p>VideoCall</p>
      <div>
        <video
          id="localVideo"
          onClick={switchMobileCamera}
          muted
          playsInline
          autoPlay
        />
        <video
          id="remoteVideo"
          onClick={switchMobileCamera}
          muted
          playsInline
          autoPlay
        />
      </div>
      <div>
        <button onClick={sendMessageHelper}>Send message</button>
        <button id="sendOfferButton" onClick={createAndSendAnswer}>
          Answer
        </button>
      </div>
    </>
  );
};

export default VideoCall;
