import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { stock_order } from './constants/constants';
import { OrderDto } from './dto/order.dto';
import { OrderEntity } from './entities/order_entity';

@Injectable()
export class ExchangeOrderService {
  constructor(
    @InjectRepository(OrderEntity, 'timeScale')
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
  ) {}

  startTrading(body: OrderDto) {
    console.log(stock_order[body.company]);
    return  this.matchingService.send(stock_order[body.company], body.company);
  //  return this.matchingService.send('tata_mtr', 'TATA_MOTORS');
      // this.matchingService.send('irctc', 'IRCTC');
    // return  this.matchingService.send('mrf', 'MRF');
    // // console.log(value);
    // return 'Completed';
    // // console.log(stock_order[body.company]);
  }

  createOrder(data: any) {
    let orderData = JSON.parse(data);
    console.log(`This is order data ${orderData}`);
    let order = new OrderEntity();
    order = orderData;
    order.updated_at = new Date(orderData.updated_at);
    console.log(order);
    return this.orderRepository.save(order);
  }
}
