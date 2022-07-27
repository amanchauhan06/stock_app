import { Inject } from '@nestjs/common';
import {
    ConnectedSocket, WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket } from 'socket.io';
export type MySocket = Socket & { nickname: string };

@WebSocketGateway({cors: true})
export class ExchangeOrderGateway {
  // @WebSocketServer()
  // server: Server;
  constructor(@Inject('REDIS_CLIENT2') private readonly redis: Redis) {}

    handleConnection(@ConnectedSocket() socket: MySocket) {
      console.log(`[ ${socket.id} ] connected`);
      socket.on('startTrading', (data) => {
        console.log('Inside socket.on');
        this.redis.subscribe('trade', (data) => {
          console.log('This is message ' + data);
          socket.emit('trade', data);
        });
      });
    }

    async handleDisconnect(@ConnectedSocket() socket: MySocket) {
      console.log(`[ ${socket?.nickname ?? socket.id} ] disconnected`);
    }
}
