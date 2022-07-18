import log from "lib/log";
import { useEffect, useState } from "react";

import { rtcPeerConnectionConfig } from "shared/constants";

interface UseRTCConnectionProps {
  enabled: boolean;
  onConnect?: () => void;
  onTrackAdded?: (event: any) => void;
  onIceCandidate?: (event: any) => void;
}

const useRTCConnection = ({
  enabled,
  onTrackAdded,
  onConnect,
  onIceCandidate,
}: UseRTCConnectionProps) => {
  const [connection, setConnection] = useState<RTCPeerConnection>();

  useEffect(() => {
    if (enabled) {
      createRTCPeerConnection();
    }
  }, [enabled]);

  const createRTCPeerConnection = () => {
    if ((connection as any)?.addTrack) {
      return;
    }
    const currentConnection = new RTCPeerConnection(rtcPeerConnectionConfig);
    setConnection(currentConnection);

    // Add both video and audio tracks to the connection
    if (onConnect && typeof onConnect === "function") {
      onConnect();
    }
    // for (const track of (currentConnection as any)?.getTracks()) {
    //   log("Sending Stream.");
    //   state.existingTracks.push(
    //     (currentConnection as any).addTrack(track, currentConnection)
    //   );
    // }

    // This event handles displaying remote video and audio feed from the other peer
    (currentConnection as any).ontrack = (event: any) => {
      log("Recieved Stream.", event);
      if (onTrackAdded && typeof onTrackAdded === "function") {
        onTrackAdded(event);
      }
      //   setState((oldState) => {
      //     const previousRemoteStreams = oldState.remoteStreams;
      //     const existInList = previousRemoteStreams.find(
      //       (stream) => stream.id === event.streams[0].id
      //     );
      //     if (!existInList) {
      //       (document.getElementById(
      //         `remoteVideo-${previousRemoteStreams.length + 1}`
      //       ) as any)!.srcObject = event.streams[0];
      //       previousRemoteStreams.push(event.streams[0]);
      //       return { ...oldState, remoteStreams: previousRemoteStreams };
      //     }
      //     return oldState;
      //   });
    };

    // This event sends the ice candidates generated from Stun or Turn server to the Receiver over web socket
    (currentConnection as any).onicecandidate = (event: any) => {
      console.log("On ice candidate called");
      if (event.candidate) {
        log("Sending Ice Candidate - " + event.candidate.candidate);
        if (onIceCandidate && typeof onIceCandidate === "function") {
          onIceCandidate(event);
        }

        // sendMessage({
        //   senderId: clientId,
        //   receiverId: receiverIds,
        //   timestamp: new Date(),
        //   content: {
        //     id: uuid(),
        //     value: JSON.stringify({
        //       type: "CANDIDATE",
        //       data: event.candidate,
        //     }),
        //   },
        // });
      }
    };

    // This event logs messages and handles button state according to WebRTC connection state changes
    (currentConnection as any).onconnectionstatechange = function (
      event: any
    ) {
      switch ((currentConnection as any).connectionState) {
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
  };

  return { connection };
};

export default useRTCConnection;
