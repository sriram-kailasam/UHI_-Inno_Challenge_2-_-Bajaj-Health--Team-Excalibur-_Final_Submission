import { SendMessageRequest } from "../dto/sendMessage.dto";
import { SocketServer } from "../sockets";

export function sendMessage(request: SendMessageRequest) {
  SocketServer.sendTo(request.receiverId, request.content.value)
}