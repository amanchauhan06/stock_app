import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/passport';
import { StockDataQueryDTO } from './stock_data.dto';
import { StockDetailService } from './stock_detail.service';
import { StockPriceQueryDTO } from './stock_price.dto';

@ApiHeader({ name: 'app_secret', required: true, description: 'Custom Header' })
@Controller('stock-detail')
export class StockDetailController {
  constructor(private readonly stockDetailService: StockDetailService) {}

  @Get('migrateData')
  readUser() {
    return this.stockDetailService.migrateData();
  }

  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('stocks')
  async stocks(@Query() query: StockDataQueryDTO, @Res() res: Response) {
    const stocksValue = await this.stockDetailService.stocks(query);
    if (!stocksValue || stocksValue.length == 0) {
      res
        .status(404)
        .json({ status: 'Failed', message: 'No Stock Data Found' });
    } else if (stocksValue) {
      res.status(200).json({ status: 'Success', data: stocksValue });
    }
  }

  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('price/:id')
  async stockById(
    @Param('id') id: String,
    @Query() query: StockPriceQueryDTO,
    @Res() res: Response,
  ) {
    const stocksPriceValue = await this.stockDetailService.stockById(id, query);
    if (!stocksPriceValue || stocksPriceValue.length == 0) {
      res
        .status(404)
        .json({ status: 'Failed', message: 'No Stock Data Found' });
    } else if (stocksPriceValue) {
      res.status(200).json({ status: 'Success', data: stocksPriceValue });
    }
  }
}
