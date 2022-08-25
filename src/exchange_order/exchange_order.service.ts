import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { stock_order } from './constants/constants';
import { OrderDto } from './dto/order.dto';
import { OrderEntity } from './entities/order_entity';

@Injectable()
export class ExchangeOrderService implements OnModuleInit{
  constructor(
    @InjectRepository(OrderEntity, 'timeScale')
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject('REDIS_CLIENT2') private readonly redis: Redis,
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
    ) {}
    
    onModuleInit() {
      this.redis.subscribe(
              stock_order[`TATAMOTORS_PUB`],
              (data) => {
                this.createOrder(data); 
              },
            );
    }
  startTrading(body: OrderDto) {
    return  this.matchingService.send(stock_order[body.company], body.company);
  }

  createOrder(data: any) {
    let orderData = JSON.parse(data);
    let order = new OrderEntity();
    order = orderData;
    return this.orderRepository.save(order);
  }
}
