import { Controller, Get } from '@nestjs/common';
import { StockDetailService } from './stock_detail.service';


@Controller('stock-detail')
export class StockDetailController {
    constructor(private readonly stockDetailService: StockDetailService) {}

    @Get()
    readUser(){
        console.log('I am here')
        return this.stockDetailService.migrateData();
    }
}
