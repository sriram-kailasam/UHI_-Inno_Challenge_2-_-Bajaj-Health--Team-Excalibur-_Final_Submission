import { FC, useEffect, useRef } from "react";
import { useSetState } from "react-use";
import { useSocket } from "socket.io-react-hook";

import log from "lib/log";
import {
  HSPA_WEB_SOCKET_URL_NGROK,
  rtcPeerConnectionConfig,
} from "shared/constants";
import { useMessage } from "modules/tele-communication/services/message";
import { v4 as uuid } from "uuid";

interface Props {
  clientId?: string;
}

interface State {
  cameraMode: "user" | "environment";
  localStream: any;
  existingTracks: any[];
}

const VideoCall: FC<Props> = ({ clientId = "mohit@hpr.abdm" }) => {
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

  const createRTCPeerConnection = () => {
    if ((connection.current as any).addTrack) {
      return;
    }
    console.log(connection.current);
    connection.current = new RTCPeerConnection(rtcPeerConnectionConfig);

    // Add both video and audio tracks to the connection
    for (const track of state.localStream.getTracks()) {
      log("Sending Stream.");
      state.existingTracks.push(
        (connection.current as any).addTrack(track, state.localStream)
      );
    }

    // This event handles displaying remote video and audio feed from the other peer
    (connection.current as any).ontrack = (event: any) => {
      log("Recieved Stream.");
      (document.getElementById("remoteVideo") as any)!.srcObject =
        event.streams[0];
    };

    // This event handles the received data channel from the other peer
    (connection.current as any).ondatachannel = function (event: any) {
      log("Recieved a DataChannel.");
      //   channel = event.channel;
      //   setChannelEvents(channel);
      //   document.getElementById("sendMessageButton").disabled = false;
    };

    // This event sends the ice candidates generated from Stun or Turn server to the Receiver over web socket
    (connection.current as any).onicecandidate = (event: any) => {
      console.log("On ice candidate called");
      if (event.candidate) {
        log("Sending Ice Candidate - " + event.candidate.candidate);

        sendMessage({
          senderId: clientId,
          receiverId: ["airesh@abha"],
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
    console.log(connection.current);
    (connection.current as any).createOffer().then(
      (offer: any) => {
        log("Sent The Offer.");

        sendMessage({
          senderId: clientId,
          receiverId: ["airesh@abha"],
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

  const {
    mutation: { mutateAsync: sendMessage },
  } = useMessage();

  const sendMessageHelper = async () => {
    const response = await sendMessage({
      senderId: clientId,
      receiverId: ["airesh@abha"],
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
          log(e.name + ": " + e.message);
        });
    } else {
      navigator.getWebcam(
        { audio: true, video: true },
        function (stream: any) {
          initiateSocketAndPeerConnection(stream);
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
      ></video>
      <video
        id="remoteVideo"
        onClick={switchMobileCamera}
        muted
        playsInline
        autoPlay
      ></video>
      <div>
        <button onClick={sendMessageHelper}>Send message</button>
        <button id="sendOfferButton" onClick={createAndSendOffer}>
          Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
