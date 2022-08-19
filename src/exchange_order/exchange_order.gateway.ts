import { Inject } from '@nestjs/common';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket } from 'socket.io';
import { stock_order } from './constants/constants';
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
    socket.on('getPrice', (data) => {
     const jsonData = JSON.parse(data);
      this.redis.subscribe(stock_order[`${jsonData['company']}_PUB`], (data) => {
        this.exchangeOrderService.createOrder(data);
        console.log(`${jsonData['company']}_price`);
        socket.emit(`${jsonData['company']}_price`, data);
      });
    });
  }

  async handleDisconnect(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket?.nickname ?? socket.id} ] disconnected`);
  }
}
