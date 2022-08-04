import { Inject } from '@nestjs/common';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket } from 'socket.io';
import { ExchangeOrderService } from './exchange_order.service';
export type MySocket = Socket & { nickname: string };

@WebSocketGateway({ cors: true })
export class ExchangeOrderGateway {
  constructor(
    @Inject('REDIS_CLIENT2') private readonly redis: Redis,
    private readonly exchangeOrderService: ExchangeOrderService,
  ) {}

  handleConnection(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket.id} ] connected`);
    socket.on('startTrading', (data) => {
      this.redis.subscribe('trade', (data) => {
        this.exchangeOrderService.createOrder(data)
        socket.emit('trade', data);
      });
    });
  }

  async handleDisconnect(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket?.nickname ?? socket.id} ] disconnected`);
  }
}
