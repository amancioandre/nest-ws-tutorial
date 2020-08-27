import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: "/chat"
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger("ChatGateway");

  @WebSocketServer() wss: Server

  afterInit(server: Server): void {
    this.logger.log("Initialized")
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, message: string, room: string }): void {
    this.wss.to(message.room).emit("chatToClient", message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room)
    client.emit('joinedRoom', room)
  }

  @SubscribeMessage('joinRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room)
    client.emit('leaveRoom', room)
  }
}
