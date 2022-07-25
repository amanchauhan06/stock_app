import { Controller, Post } from '@nestjs/common';
import { ExchangeOrderService } from './exchange_order.service';
@Controller('order')
export class ExchangeOrderController {
  constructor(private readonly exchangeOrderService: ExchangeOrderService) {}

  @Post()
  startTrading() {
    return this.exchangeOrderService.startTrading();
  }
}
