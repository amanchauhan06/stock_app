import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSecretMiddleware } from './app_secret.middleware';
import { MasterSchema } from './master.model';
import { StockDetailController } from './stock_detail.controller';
import { StockDetailSchema } from './stock_detail.model';
import { StockDetailService } from './stock_detail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'companyMasterData', schema: MasterSchema },
    ]),
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
