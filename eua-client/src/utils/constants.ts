export const baseUrl = 'https://bfhl-group-consult.herokuapp.com/api'
export const HSPA_WEB_SOCKET_URL_NGROK = "wss://9508-117-99-248-86.in.ngrok.io";
export const HSPA_WEB_SOCKET_URL_HEROKU =
  "wss://bfhl-group-consult.herokuapp.com/";

export const rtcPeerConnectionConfig = {
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  };
