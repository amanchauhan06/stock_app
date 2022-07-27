import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeOrderGateway } from './exchange_order/exchange_order.gateway';
import { ExchangeOrderModule } from './exchange_order/exchange_order.module';
import { StockDetailModule } from './stock_detail/stock_detail.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING),
    StockDetailModule,
    ExchangeOrderModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
