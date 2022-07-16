// @ts-nocheck
import { useState, useEffect } from "react";
import { HSPA_WEB_SOCKET_URL_NGROK } from "shared/constants";
import io from "socket.io-client";

const socket = io(HSPA_WEB_SOCKET_URL_NGROK, { query: { userId: '12345678' } });

const useSocketIO = (options = {}, shouldConnect = false) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  return {};
};

export default useSocketIO;
