import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/passport';
import { StockDataQueryDTO } from './dto/stock_data.dto';
import { StockDetailService } from './stock_detail.service';
import { StockPriceQueryDTO } from './dto/stock_price.dto';

@ApiHeader({ name: 'app_secret', required: true, description: 'Custom Header' })
@ApiBearerAuth('defaultBearerAuth')
@Controller('stock-detail')
export class StockDetailController {
  constructor(private readonly stockDetailService: StockDetailService) {}

  @Get('migrateData')
  readUser() {
    return this.stockDetailService.migrateData();
  }

  @Post('add-fundamentals/:id')
  async addStockFundamentals(@Param('id') id: string, @Res() res: Response) {
    try {
      const stockFundamentals =
        await this.stockDetailService.addStockFundamentals(id);
      res.status(200).json({ status: 'Success', data: stockFundamentals });
    } catch (err) {
      res.status(404).json({ status: 'Failed', message: err.message });
    }
  }

  @Post('add-about/:id')
  async addAboutStock(@Param('id') id: string, @Res() res: Response) {
    try {
      const stockFundamentals = await this.stockDetailService.addAboutStock(id);
      res.status(200).json({ status: 'Success', data: stockFundamentals });
    } catch (err) {
      res.status(404).json({ status: 'Failed', message: err.message });
    }
  }

  @ApiOperation({ summary: 'To get all the stocks' })
  @ApiResponse({ status: 200, description: 'All stocks fetched successfully' })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('stocks')
  @ApiBearerAuth('defaultBearerAuth')
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

  @ApiOperation({ summary: 'To get price of a particular stock' })
  @ApiResponse({ status: 200, description: 'Price fetched successfully' })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('price/:id')
  @ApiBearerAuth('defaultBearerAuth')
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

  @ApiOperation({ summary: 'To get fundamentals of a particular stock' })
  @ApiResponse({
    status: 200,
    description: 'Fundamentals fetched successfully',
  })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('fundamentals/:id')
  @ApiBearerAuth('defaultBearerAuth')
  async stockFundamentals(@Param('id') id: string, @Res() res: Response) {
    const stockDetails = await this.stockDetailService.getStockFundamentals(id);
    if (!stockDetails || stockDetails.length == 0) {
      res
        .status(404)
        .json({ status: 'Failed', message: 'No Stock Data Found' });
    } else if (stockDetails) {
      res.status(200).json({ status: 'Success', data: stockDetails });
    }
  }

  @ApiOperation({ summary: 'To get about details of a particular stock' })
  @ApiResponse({
    status: 200,
    description: 'About details fetched successfully',
  })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('about/:id')
  @ApiBearerAuth('defaultBearerAuth')
  async aboutStock(@Param('id') id: string, @Res() res: Response) {
    const stockDetails = await this.stockDetailService.getAboutStock(id);
    if (!stockDetails || stockDetails.length == 0) {
      res
        .status(404)
        .json({ status: 'Failed', message: 'No Stock Data Found' });
    } else if (stockDetails) {
      res.status(200).json({ status: 'Success', data: stockDetails });
    }
  }
}
