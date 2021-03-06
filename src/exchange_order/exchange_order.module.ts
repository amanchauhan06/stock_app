import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { createClient } from 'redis';
import { ExchangeOrderController } from './exchange_order.controller';
import { ExchangeOrderGateway } from './exchange_order.gateway';
import { ExchangeOrderRequestSchema } from './exchange_order.model';
import { ExchangeOrderService } from './exchange_order.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'exchangeOrder', schema: ExchangeOrderRequestSchema },
    ]),
    ClientsModule.register([
      {
        name: 'MATCHING_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        },
      },
    ]),
  ],
  controllers: [ExchangeOrderController],
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        url: 'redis://localhost:6379',
      },
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: 'REDIS_CLIENT2',
      useFactory: async (options: { url: string }) => {
        const client = createClient(options);
        await client.connect();
        return client;
      },
    },
    ExchangeOrderService,
    ExchangeOrderGateway,
  ],
  exports: ['REDIS_CLIENT2'],
})
export class ExchangeOrderModule {}
