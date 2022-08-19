import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../ormconfig';
import { ormConfigTimeScale } from '../timescaleconfig';
import { ExchangeOrderModule } from './exchange_order/exchange_order.module';
import { StockDetailModule } from './stock_detail/stock_detail.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forRoot(ormConfigTimeScale),
    // MongooseModule.forRoot(process.env.MONGO_DB_CONNECTION_STRING),
    StockDetailModule,
    ExchangeOrderModule,
    UsersModule,
    AuthModule,
    WishlistModule,
  ],
})
export class AppModule {}
