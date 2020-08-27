import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: "/"
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger("AppGateway");

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

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit("msgToClient", text)
    // return { event: "msgToClient", data: text };
  }
}
