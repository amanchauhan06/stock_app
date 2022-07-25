import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeOrderModule } from './exchange_order/exchange_order.module';
import { StockDetailModule } from './stock_detail/stock_detail.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING),
    StockDetailModule,
    ExchangeOrderModule,
  ],
})
export class AppModule {}
