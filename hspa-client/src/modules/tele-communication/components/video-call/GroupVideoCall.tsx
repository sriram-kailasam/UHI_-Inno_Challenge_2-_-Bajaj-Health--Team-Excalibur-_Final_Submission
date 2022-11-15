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

interface Props {}

interface State {
  cameraMode: "user" | "environment";
  existingTracks: any[];
  remoteStreams: any[];
  stopPolling: boolean;
}

const GroupVideoCall: FC<Props> = () => {
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
    stopPolling: false,
  });

  const primaryDoctorConnection = useRef({});
  const patientConnection = useRef({});
  const localStream = useRef();

  useEffect(() => {
    getLocalWebCamFeed();
  }, []);

  /**
   * Poll the HSPA - 1 application if it's the HSPA - 2 application
   *
   */
  useEffect(() => {
    let interval: any;
    if (!state.stopPolling) {
      interval = setInterval(() => {
        sendMessage({
          senderId: clientId,
          appointmentId,
          receiverId: [remoteDoctorId],
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "READY",
              data: true,
              sender: clientId
            }),
          },
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [state.stopPolling]);

  const { socket, connected } = useSocket(HSPA_WEB_SOCKET_URL, {
    transports: ["websocket"],
    query: {
      userId: clientId,
    },
  });

  useEffect(() => {
    console.log(localStream.current);
    if (connected && localStream.current) {
      createRTCPeerConnection(primaryDoctorConnection, 1);
      createRTCPeerConnection(patientConnection, 2);
    }
  }, [connected, localStream.current]);

  const onSocketMessage = (message: string) => {
    if (!message || message.includes("Connected as")) {
      return;
    }

    const parsedMessage = JSON.parse(message);
    const { data, sender: senderId, type } = parsedMessage;

    console.log("Message received", parsedMessage);
    if (senderId === clientId) {
      return;
    }

    if (type === "OFFER") {
      handleOffer({ offer: data, senderId });
    }
    if (type === "CANDIDATE") {
      handleCandidate({ candidate: data, senderId });
    }
    if (type === "ANSWER") {
      handleAnswer({ answer: data, senderId });
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
      setState((oldState) => {
        const previousRemoteStreams = oldState.remoteStreams;
        (document.getElementById(`remoteVideo-${index}`) as any)!.srcObject =
          event.streams[0];
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
              data: {
                to: patientId,
                from: clientId,
                session_id: `${clientId}-${patientId}`,
                candidate: {
                  sdpMLineIndex: event.candidate.sdpMLineIndex,
                  sdpMid: event.candidate.sdpMid,
                  candidate: event.candidate.candidate,
                },
                sender: clientId,
              },
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
  const handleCandidateDoctor = ({ candidate }: { candidate: any }) => {
    // Avoid accepting the ice candidate if this is a message created by the current peer
    log("Adding Ice Candidate - ", candidate.candidate);
    (primaryDoctorConnection.current as any).addIceCandidate(
      new RTCIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      })
    );
  };
  const handleCandidatePatient = ({ candidate }: { candidate: any }) => {
    // Avoid accepting the ice candidate if this is a message created by the current peer
    log("Adding Ice Candidate - " + candidate.candidate);
    (patientConnection.current as any).addIceCandidate(
      new RTCIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      })
    );
  };

  const handleOffer = ({
    offer,
    senderId,
  }: {
    offer: any;
    senderId: string;
  }) => {
    if (senderId === remoteDoctorId) {
      handleOfferDoctor(offer);
      createAndSendOfferToPatient();
      setState({ stopPolling: true });
    }
  };
  /**
   * Accepts Offer received from the Caller
   */
  const handleOfferDoctor = (offer: any) => {
    log("Recieved The Offer.");
    (primaryDoctorConnection.current as any).setRemoteDescription(
      new RTCSessionDescription({
        sdp: offer.description.sdp,
        type: offer.description.type,
      })
    );
  };

  /**
   * Accepts Answer received from the Receiver
   */
  const handleAnswer = ({
    answer,
    senderId,
  }: {
    answer: any;
    senderId: string;
  }) => {
    if (patientId === senderId) {
      handleAnswerPatient(answer);
    }
  };
  const handleAnswerPatient = ({ description: answer }: { description: any }) => {
    // Avoid accepting the Answer if this is a message created by the current peer
    log("Recieved The Answer", answer);
    (patientConnection.current as any).setRemoteDescription(
      new RTCSessionDescription({ sdp: answer.sdp, type: answer.type })
    );
  };

  /**
   * Creates and sends the Offer to the Receiver
   * Creates a Data channel for exchanging text messages
   * This function is invoked by the Caller
   */
  const createAndSendOfferToPatient = () => {
    // Create Offer
    (patientConnection.current as any).createOffer().then(
      (offer: any) => {
        log("Sent The Offer.");

        sendMessage({
          senderId: clientId,
          appointmentId,
          receiverId: [patientId],
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "OFFER",
              data: {
                to: patientId,
                from: clientId,
                session_id: `${clientId}-${patientId}`,
                description: { sdp: offer.sdp, type: offer.type },
                media: "video",
              },
              sender: clientId
            }),
          },
        });

        // Set Offer for negotiation
        (patientConnection.current as any).setLocalDescription(offer);
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
  const createAndSendAnswerToPrimaryDoctor = () => {
    // Create Answer
    (primaryDoctorConnection.current as any).createAnswer().then(
      (answer: any) => {
        console.log("Sent The Answer.");

        // Set Answer for negotiation
        (primaryDoctorConnection.current as any).setLocalDescription(answer);

        // Send Answer to other peer
        sendMessage({
          senderId: clientId,
          appointmentId,
          receiverId: [remoteDoctorId],
          timestamp: new Date(),
          content: {
            id: uuid(),
            value: JSON.stringify({
              type: "ANSWER",
              data: {
                to: remoteDoctorId,
                from: clientId,
                session_id: `${remoteDoctorId}-${clientId}`,
                description: { sdp: answer.sdp, type: answer.type },
              },
              sender: clientId,
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
      <p>GroupVideoCall</p>
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
        <Button
          id="sendOfferButton"
          onClick={createAndSendAnswerToPrimaryDoctor}
        >
          Answer
        </Button>
      </div>
    </div>
  );
};

export default GroupVideoCall;
