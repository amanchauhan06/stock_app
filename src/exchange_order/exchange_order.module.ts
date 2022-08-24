import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createClient } from 'redis';
import { OrderEntity } from './entities/order_entity';
import { ExchangeOrderController } from './exchange_order.controller';
import { ExchangeOrderGateway } from './exchange_order.gateway';
import { ExchangeOrderService } from './exchange_order.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: 'exchangeOrder', schema: ExchangeOrderRequestSchema },
    // ]),
    TypeOrmModule.forFeature([OrderEntity], 'timeScale'),
    ClientsModule.register([
      {
        name: 'MATCHING_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
          password: process.env.REDIS_PASSWORD,
        },
      },
    ]),
  ],
  controllers: [ExchangeOrderController],
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
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
