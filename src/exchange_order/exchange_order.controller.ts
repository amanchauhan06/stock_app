import { Body, Controller, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { ExchangeOrderService } from './exchange_order.service';
@Controller('order')
export class ExchangeOrderController {
  constructor(private readonly exchangeOrderService: ExchangeOrderService) {}

  @Post()
  async startTrading(@Body() body: OrderDto) {
    return this.exchangeOrderService.startTrading(body);
  }
}
