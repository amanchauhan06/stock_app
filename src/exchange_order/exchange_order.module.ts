import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeOrderController } from './exchange_order.controller';
import { ExchangeOrderRequestSchema } from './exchange_order.model';
import { ExchangeOrderService } from './exchange_order.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'exchangeOrder', schema: ExchangeOrderRequestSchema },
    ]),
    ClientsModule.register([{
      name: 'MATCHING_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://iavpjlft:N4u9fnHJvjeK-Cd8_vd5Y4WN5BUAsrsz@moose.rmq.cloudamqp.com/iavpjlft'],
        queue: 'matching_service',
        queueOptions: {
          durable: false
        },
      },
    }]),
  ],
  controllers: [ExchangeOrderController],
  providers: [ExchangeOrderService],
})
export class ExchangeOrderModule {}
