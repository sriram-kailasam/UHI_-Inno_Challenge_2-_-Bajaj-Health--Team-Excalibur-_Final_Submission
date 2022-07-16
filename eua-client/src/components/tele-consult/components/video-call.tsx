import { FC, useEffect, useRef } from "react";
import { useSetState } from "react-use";

import {
  HSPA_WEB_SOCKET_URL_NGROK,
  rtcPeerConnectionConfig,
} from "../../../utils/constants";
import { useMessage } from "../services/message";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

interface Props {}

interface State {
  cameraMode: "user" | "environment";
  localStream: any;
  existingTracks: any[];
}

const VideoCall: FC<Props> = () => {
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
      userId: "airesh@abha",
    },
  });

  useEffect(() => {
    if (connected) {
      createRTCPeerConnection();
    }
  }, [connected]);

  const { lastMessage } = useSocketEvent(socket, "message");
  useEffect(() => {
    console.log(socket);
    socket.on("message", (message: any) => {
      console.log(message, "****** check the message here");
    });
  }, [socket]);

  useEffect(() => {
    console.log('check last message here', lastMessage);
  }, [lastMessage]);

  function createRTCPeerConnection() {
    if (!(connection.current as any).addTrack) {
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
      console.log("Recieved Stream.");
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

        // socket.send(
        //   JSON.stringify({
        //     action: "onMessage",
        //     type: "candidate",
        //     data: event.candidate,
        //     id: clientId,
        //   })
        // );
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
      senderId: "bfhl-HSPA",
      receiverId: "bfhl-EUA",
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
      <video
        id="localVideo"
        onClick={switchMobileCamera}
        muted
        playsInline
        autoPlay
      ></video>
      <button onClick={sendMessageHelper}>Send message</button>
    </>
  );
};

export default VideoCall;
