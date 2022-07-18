export const HSPA_WEB_SOCKET_URL_NGROK =
    "wss://98cf-106-193-200-154.in.ngrok.io";
export const HSPA_WEB_SOCKET_URL_HEROKU =
    "wss://bfhl-group-consult.herokuapp.com/";

export const HSPA_WEB_SOCKET_URL = HSPA_WEB_SOCKET_URL_NGROK;

export const BASE_URL_HEROKU = "https://bfhl-group-consult.herokuapp.com/api";
export const BASE_URL_NGROK = "https://98cf-106-193-200-154.in.ngrok.io/api";
export const baseUrl = BASE_URL_HEROKU;

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
