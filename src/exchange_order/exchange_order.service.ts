import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Redis from 'ioredis';

@Injectable()
export class ExchangeOrderService {
  constructor(
    @Inject('REDIS_CLIENT2') private readonly redis: Redis,
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
  ) {}
  startTrading() {
    this.redis.subscribe('trade', (data) => {console.log('This is message '+ data);});
    return this.matchingService.send(
      'startTrading',
      'Hello from the emit part',
    );
  }
}
