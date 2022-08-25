import { Body, Controller, Post, Response } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { ExchangeOrderService } from './exchange_order.service';
@Controller('order')
export class ExchangeOrderController {
  constructor(private readonly exchangeOrderService: ExchangeOrderService) {}

  @Post()
  async startTrading(@Body() body: OrderDto) {
    var date = new Date();
    var startTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      9,
      30,
      0,
    );
    var endTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      15,
      30,
      0,
    );
    if (date < startTime || date > endTime) {
      if (date < startTime) {
        return { message: 'Market is not yet opened' };
      } else {
        return {
          message: 'Market is closed, Please place you order tomorrow',
        };
      }
    } else {
      return this.exchangeOrderService.startTrading(body);
    }
  }
}
