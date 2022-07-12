import { Module } from '@nestjs/common';
import { StockDetailModule } from './stock_detail/stock_detail.module';

@Module({
  imports: [StockDetailModule],
})
export class AppModule {}
