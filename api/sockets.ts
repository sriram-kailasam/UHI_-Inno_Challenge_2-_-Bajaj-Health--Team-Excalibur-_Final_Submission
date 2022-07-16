import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from 'http'

export class SocketServer {
  private static io?: SocketIOServer;

  private static instance?: SocketServer;
  private static clients: Record<string, Socket> = {};

  private constructor() { }

  static init(httpServer?: Server): SocketServer {
    this.io = new SocketIOServer(httpServer);
    this.io.on("connection", (socket: Socket) => {
      const { userId } = socket.handshake.query
      console.log("connected", socket.id, 'userId:', userId)

      this.clients[userId as string] = socket;


      console.log('clients', Object.keys(this.clients))
      socket.send("Connected as", userId)
    });

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

  static sendTo(userId: string, message: string) {
    this.clients[userId]?.send(message)
  }
}