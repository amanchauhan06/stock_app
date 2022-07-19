import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ExchangeOrderService {
  constructor(
    // @InjectModel('exchangeOrderData')
    // private readonly exchangeOrderModel: Model<ExchangeOrderDocument>,
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
  ) {}

  startTrading() {
      this.matchingService.connect();
      this.matchingService.emit('startTrading', 'Hello from the emit part');
      return 'Hello World!';
  }
}
