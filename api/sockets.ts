import { Server as SocketIOServer } from "socket.io";
import { Server } from 'http'

export class SocketServer {
  private static io?: SocketIOServer;

  private static instance?: SocketServer;

  private constructor() {
  }

  static init(httpServer?: Server): SocketServer {
    this.io = new SocketIOServer(httpServer);
    this.io.on("connect", socket => {
      console.log("connected", socket.id, 'data: ', socket.data)
      socket.send("Connected as", socket.id)
    })

    this.instance = new SocketServer();
    return this.instance
  }

  static getInstance(): SocketServer {
    if (this.instance) return this.instance;
    return this.init()
  }

  static broadcast(message: string) {
    SocketServer.io?.sockets.send(message)
  }


}