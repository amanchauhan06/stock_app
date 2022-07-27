import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvToJson from 'csvtojson';
import { Model, Types } from 'mongoose';
import { Repository } from 'typeorm';
import { MasterDocument } from './master.model';
import { StockDetailDocument } from './stock_detail.model';
import { StockDetailEntity } from './stock_detal.entity';

@Injectable()
export class StockDetailService {
  constructor(
    @InjectModel('companyMasterData')
    private readonly masterModel: Model<MasterDocument>,
    @InjectModel('stockDetail')
    private readonly stockDetailModel: Model<StockDetailDocument>,
    @InjectRepository(StockDetailEntity)
    private readonly stockEntity: Repository<StockDetailEntity>,
  ) {}

  async migrateData() {
    const jsonArray = await csvToJson().fromFile(
      //   `/Users/amanchauhan/Desktop/archive/FullDataCsv/TATAMOTORS__EQ__NSE__NSE__MINUTE.csv`,
      `/Users/amanchauhan/Screenshots/stockData/FullDataCsv/IRCTC__EQ__NSE__NSE__MINUTE.csv`,
    );
    for (let j = 31983; j < jsonArray.length; j++) {
      jsonArray[j].timestamp = new Date(jsonArray[j].timestamp).toISOString();
      const stockPrice = new StockDetailEntity();
      stockPrice.timestamp = jsonArray[j].timestamp;
      stockPrice.open = jsonArray[j].open === '' ? 0 :parseInt(jsonArray[j].open);
      stockPrice.high =jsonArray[j].high === '' ?0: parseInt(jsonArray[j].high);
      stockPrice.low = jsonArray[j].low === '' ? 0 :parseInt(jsonArray[j].low);
      stockPrice.close = jsonArray[j].close === '' ? 0 :parseInt(jsonArray[j].close);
      stockPrice.volume = jsonArray[j].volume === '' ? 0 :parseInt(jsonArray[j].volume);
      stockPrice.company = '39372610-cdf3-4e71-98d6-a48465e2bb52';
      console.log(jsonArray[j]);
      await this.stockEntity.save(stockPrice);
    }

    /* Migration For the Master CSV */

    // const jsonArray = await csvToJson().fromFile(
    //   //   `/Users/amanchauhan/Desktop/archive/FullDataCsv/TATAMOTORS__EQ__NSE__NSE__MINUTE.csv`,
    //   `/Users/amanchauhan/Screenshots/stockData/FullDataCsv/master.csv`,
    // );
    // for (let j = 0; j <jsonArray.length ; j++) {
    //   // jsonArray[j].timestamp = new Date(jsonArray[j].timestamp).toISOString();
    //   const master = new MasterEntity();
    //   master.tradingsymbol = jsonArray[j].tradingsymbol;
    //   master.name = jsonArray[j].name;
    //   master.instrument_type = jsonArray[j].instrument_type;
    //   master.segment = jsonArray[j].segment;
    //   master.exchange = jsonArray[j].exchange;
    //   master.data_type = jsonArray[j].data_type;
    //   master.key = jsonArray[j].key;
    //   master.from = jsonArray[j].from;
    //   master.to = jsonArray[j].to;
    //   await this.master.save(master);
    // }
  }

  async stocks(query) {
    const { id, name } = query;
    let filter = {};
    if (name) {
      const regExp = new RegExp(name, 'i');
      filter = {
        ...{ name: regExp },
      };
    }
    if (id) {
      filter = {
        ...filter,
        ...{ company: new Types.ObjectId(id) },
      };
    }
    const stockData = await this.masterModel.find(filter);
    return stockData;
  }

  async stockById(param, query) {
    let filter = { company: new Types.ObjectId(param) };
    const { from, to } = query;
    let fromDate;
    let toDate;
    if (from && to) {
      fromDate = new Date(from);
      toDate = new Date(to);
      filter = {
        ...filter,
        ...{ timestamp: { $gte: fromDate, $lte: toDate } },
      };
    }
    const stockPrice = await this.stockDetailModel.find(filter);
    return stockPrice;
  }
}
