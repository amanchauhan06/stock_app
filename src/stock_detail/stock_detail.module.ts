import { Module } from '@nestjs/common';
import { StockDetailController } from './stock_detail.controller';
import { StockDetailService } from './stock_detail.service';

@Module({
  controllers: [StockDetailController],
  providers: [StockDetailService]
})
export class StockDetailModule {}
