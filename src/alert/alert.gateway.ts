import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({namespace: "/alert"})
export class AlertGateway {

  @WebSocketServer() wss: Server;

  sendToAll(msg: string): void {
    this.wss.emit('alertClient', { type: 'Alert', message: msg })
  }
}
