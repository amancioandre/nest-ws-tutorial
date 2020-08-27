import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: "/chat"
})
export class ChatGateway implements OnGatewayInit {
  private logger: Logger = new Logger("ChatGateway");

  @WebSocketServer() wss: Server

  afterInit(server: Server): void {
    this.logger.log("Initialized")
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

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room)
    client.emit('leftRoom', room)
  }
}
