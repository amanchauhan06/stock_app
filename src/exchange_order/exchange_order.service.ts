import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order_entity';

@Injectable()
export class ExchangeOrderService {
  constructor(
    // @InjectRepository(OrderEntity, 'timeScale')
    // private readonly masterRepository: Repository<OrderEntity>,
    // @Inject('REDIS_CLIENT2') private readonly redis: Redis,
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
  ) {}

  // startTrading() {
  //   this.redis.subscribe('trade', (data) => {
  //     console.log('This is message ' + data);
  //   });
  //   return this.matchingService.send(
  //     'startTrading',
  //     'Hello from the emit part',
  //   );
  // }

  // createOrder() {
  //   let order = new OrderEntity();
  //   order.id = randomUUID();
  //   order.price = 10;
  //   order.last_price = 10;
  //   order.traded_quantity = 10;
  //   order.name = 'test';
  //   order.updated_at = new Date();
  //   return this.masterRepository.save(order);
  // }
}
