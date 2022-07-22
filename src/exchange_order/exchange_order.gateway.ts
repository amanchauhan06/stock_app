import { Inject } from '@nestjs/common';
import {
    ConnectedSocket,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
export type MySocket = Socket & { nickname: string };

@WebSocketGateway(8080)
export class ExchangeOrderGateway {
  @WebSocketServer()
  server: Server;
  constructor(@Inject('REDIS_CLIENT2') private readonly redis: Redis) {}

  handleConnection(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket.id} ] connected`);
    socket.on('startTrading', () => {
      this.redis.subscribe('trade', (data) => {
        console.log('This is message ' + data);
        this.server.emit('trade', data);
      });
    });
  }

  async handleDisconnect(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket?.nickname ?? socket.id} ] disconnected`);
  }

  //   @SubscribeMessage('startTrading')
  //   startTrading(@MessageBody() data: { company: string }) {
  //     this.redis.subscribe('trade', (data) => {
  //       console.log('This is message ' + data);
  //       this.server.emit('trade', data);
  //     });
  //   }
}
