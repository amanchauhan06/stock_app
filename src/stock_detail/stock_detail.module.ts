import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSecretMiddleware } from './app_secret.middleware';
import { MasterEntity } from './master.entity';
import { MasterSchema } from './master.model';
import { StockDetailController } from './stock_detail.controller';
import { StockDetailSchema } from './stock_detail.model';
import { StockDetailService } from './stock_detail.service';
import { StockDetailEntity } from './stock_detal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'companyMasterData', schema: MasterSchema },
    ]),
    TypeOrmModule.forFeature([MasterEntity, StockDetailEntity]),
    MongooseModule.forFeature([
      { name: 'stockDetail', schema: StockDetailSchema },
    ]),
  ],
  controllers: [StockDetailController],
  providers: [StockDetailService],
})
export class StockDetailModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppSecretMiddleware).forRoutes(StockDetailController);
  }
}
