import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Socket } from 'socket.io';
import { stock_order } from './constants/constants';
import { ExchangeOrderService } from './exchange_order.service';
export type MySocket = Socket & { nickname: string };

@WebSocketGateway({ cors: true })
export class ExchangeOrderGateway {
  constructor(
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
    @Inject('REDIS_CLIENT2') private readonly redis: Redis,
    private readonly exchangeOrderService: ExchangeOrderService,
  ) {}

  handleConnection(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket.id} ] connected`);
    socket.on('getPrice', (data) => {
     const jsonData = JSON.parse(data);
     console.log(stock_order[jsonData['company']]);
     for (let i = 0; i < jsonData.company.length; i++) {
      this.redis.subscribe(stock_order[`${jsonData['company'][i]}_PUB`], (data) => {
        this.exchangeOrderService.createOrder(data);
        console.log(`${jsonData['company'][i]}_price`);
        socket.emit(`${jsonData['company'][i]}_price`, data);
      });
     }
      // this.redis.subscribe(stock_order[`${jsonData['company']}_PUB`], (data) => {
      //   this.exchangeOrderService.createOrder(data);
      //   console.log(`${jsonData['company']}_price`);
      //   socket.emit(`${jsonData['company']}_price`, data);
      // });
    });
  }
  async handleDisconnect(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket?.nickname ?? socket.id} ] disconnected`);
  }
}
