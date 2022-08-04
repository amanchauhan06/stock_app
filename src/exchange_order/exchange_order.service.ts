import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order_entity';

@Injectable()
export class ExchangeOrderService {
  constructor(
    @InjectRepository(OrderEntity, 'timeScale')
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
  ) {}
  startTrading() {
    return this.matchingService.send(
      'startTrading',
      'Hello from the emit part',
    );
  }

  createOrder(data:any) {
    let orderData = JSON.parse(data);
    console.log(`This is order data ${orderData}`);
    let order = new OrderEntity();
    order = orderData;
    order.updated_at = new Date(orderData.updated_at);
    console.log(order);
    return this.orderRepository.save(order);
  }
}
