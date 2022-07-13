import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockDetailService } from './stock_detail.service';


@Controller('stock-detail')
export class StockDetailController {
    constructor(private readonly stockDetailService: StockDetailService) {}

    @Get('migrateData')
    readUser(){
        return this.stockDetailService.migrateData();
    }

    @Get('stocks')
    stocks(@Query() query:any){
        return this.stockDetailService.stocks(query);
    }
    
    @Get('price/:id')
    stockById(@Param() id:String, @Query() query:any){
        return this.stockDetailService.stockById(id, query);
    }
}
