import { FC, useEffect, useRef } from "react";
import { useSetState } from "react-use";
import { useSocket } from "socket.io-react-hook";

import log from "lib/log";
import { HSPA_WEB_SOCKET_URL, rtcPeerConnectionConfig } from "shared/constants";
import { useMessage } from "modules/tele-communication/services/message";
import { v4 as uuid } from "uuid";
import Button from "shared/common-ui/atoms/Button";
import { useLocation } from "react-router-dom";
import { type GroupVideoCallData } from "modules/tele-communication/types";
import createAndSendOffer from "modules/tele-communication/util/create-and-send-offer";

interface Props {}

interface State {
  cameraMode: "user" | "environment";
  existingTracks: any[];
  remoteStreams: any[];
  ready: {
    remoteDoctor: boolean;
    patient: boolean;
  };
}

const GroupVideoCallPrimary: FC<Props> = () => {
  const location = useLocation();
  const videoCallData = location.state as GroupVideoCallData;
  const {
    clientId = "mohit@hpr.abdm",
    patientId = "airesh@abha",
    remoteDoctorId = "sriram@hpr.abdm",
    appointmentId,
  } = videoCallData || {};

  const [state, setState] = useSetState<State>({
    cameraMode: "user",
    existingTracks: [],
    remoteStreams: [],
    ready: {
      remoteDoctor: false,
      patient: false,
    },
  });

  // Doctor connection
  const doctorConnection = useRef({});
  // Patient connection
  const patientConnection = useRef({});
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
    console.log(localStream.current);
    if (connected && localStream.current) {
      createRTCPeerConnection(doctorConnection, 1);
      createRTCPeerConnection(patientConnection, 2);
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

    if (type === "CANDIDATE") {
      handleCandidate({ candidate: data, senderId });
    }
    if (type === "ANSWER") {
      handleAnswer({ answer: data, senderId });
    }
    if (type === "READY") {
      handleReady({ data, senderId });
    }
  };

  useEffect(() => {
    socket.on("message", onSocketMessage);
  }, [socket]);

  const createRTCPeerConnection = (connection: any, index: number) => {
    if (connection.current.addTrack) {
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
        connection.current.addTrack(track, localStream.current)
      );
    }

    // This event handles displaying remote video and audio feed from the other peer
    connection.current.ontrack = (event: any) => {
      log("Recieved Stream.", event);
      (document.getElementById(`remoteVideo-${index}`) as any)!.srcObject =
        event.streams[0];
      setState((oldState) => {
        const previousRemoteStreams = oldState.remoteStreams;
        previousRemoteStreams.push(event.streams[0]);
        return { ...oldState, remoteStreams: previousRemoteStreams };
      });
    };

    // This event sends the ice candidates generated from Stun or Turn server to the Receiver over web socket
    connection.current.onicecandidate = (event: any) => {
      console.log("On ice candidate called");
      if (event.candidate) {
        log("Sending Ice Candidate - " + event.candidate.candidate);

        sendMessage({
          senderId: clientId,
          appointmentId,
          receiverId: [index === 1 ? remoteDoctorId : patientId],
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
  };

  const handleCandidate = ({
    candidate,
    senderId,
  }: {
    candidate: any;
    senderId: string;
  }) => {
    if (senderId === patientId) {
      handleCandidatePatient(candidate);
    } else {
      handleCandidateDoctor(candidate);
    }
  };
  const handleCandidateDoctor = (candidate: any) => {
    // Avoid accepting the ice candidate if this is a message created by the current peer
    log("Adding Ice Candidate Doctor - " + candidate.candidate);
    (doctorConnection.current as any).addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  };

  const handleCandidatePatient = (candidate: any) => {
    log("Adding Ice Candidate Patient - " + candidate.candidate);
    (patientConnection.current as any).addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  };

  const handleAnswer = ({
    answer,
    senderId,
  }: {
    answer: any;
    senderId: string;
  }) => {
    if (senderId === patientId) {
      handleAnswerPatient(answer);
    } else {
      handleAnswerDoctor(answer);
    }
  };
  /**
   * Accepts Answer received from the Receiver
   */
  const handleAnswerDoctor = (answer: any) => {
    log("Recieved The Answer");
    (doctorConnection.current as any).setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleAnswerPatient = (answer: any) => {
    // Avoid accepting the Answer if this is a message created by the current peer
    log("Recieved The Answer");
    (patientConnection.current as any).setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleReady = ({ data, senderId }: { data: any; senderId: string }) => {
    console.log(data, senderId, '******** check this');
    if (data) {
      if (senderId === patientId) {
        setState((oldState) => ({
          ready: { ...oldState.ready, patient: true },
        }));
      } else {
        setState((oldState) => ({
          ready: { ...oldState.ready, remoteDoctor: true },
        }));
      }
      // Handle the ready state here
    }
  };

  /**
   * Creates and sends the Offer to the Receiver
   * Creates a Data channel for exchanging text messages
   * This function is invoked by the Caller
   */
  const createAndSendOfferHandler = () => {
    createAndSendOffer(doctorConnection, sendMessage, {
      clientId,
      receiverIds: [remoteDoctorId],
    });
    createAndSendOffer(patientConnection, sendMessage, {
      clientId,
      receiverIds: [patientId],
    });
  };

  /**
   * Creates and sends the Answer to the Caller
   * This function is invoked by the Receiver
   */
  const {
    mutation: { mutateAsync: sendMessage },
  } = useMessage();

  const initiateSocketAndPeerConnection = (stream: any) => {
    (document.getElementById("localVideo") as any)!.srcObject = stream;
    localStream.current = stream;
    setState({ existingTracks: [stream] });
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
      <p>GroupVideoCallPrimary</p>
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
        {state.ready.remoteDoctor && state.ready.patient && (
          <Button id="sendOfferButton" onClick={createAndSendOfferHandler}>
            Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupVideoCallPrimary;
