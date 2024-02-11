import { Inject, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { Gateways } from 'src/core/base/gateways';

@WebSocketGateway({
  namespace: Gateways.ph_order.Namespace,
  cors: { origin: '*' },
})
export class PhOrderGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('User connected', client.id);
    // set the driver as online
  }

  handleDisconnect(client: any) {
    console.log(`User disconnected ${client.id}`);
    // set the driver as offline
  }

  afterInit(server: any) {
    console.log(`Socket is live ${server.name}`);
  }
}
