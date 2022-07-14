import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as csvToJson from 'csvtojson';
import { Model, Types } from 'mongoose';
import { MasterDocument } from './master.model';
import { StockDetailDocument } from './stock_detail.model';

@Injectable()
export class StockDetailService {
  constructor(
    @InjectModel('companyMasterData')
    private readonly masterModel: Model<MasterDocument>,
    @InjectModel('stockDetail')
    private readonly stockDetailModel: Model<StockDetailDocument>,
  ) {}

  async migrateData() {
    const jsonArray = await csvToJson().fromFile(
      //   `/Users/amanchauhan/Desktop/archive/FullDataCsv/TATAMOTORS__EQ__NSE__NSE__MINUTE.csv`,
      `/Users/amanchauhan/Desktop/archive/FullDataCsv/IRCTC__EQ__NSE__NSE__MINUTE.csv`,
    );
    for (let j = 0; j < jsonArray.length; j++) {
      jsonArray[j].timestamp = new Date(jsonArray[j].timestamp).toISOString();
      const stockPrice = new this.stockDetailModel({
        ...jsonArray[j],
        company: new Types.ObjectId('62ce6c35cfcd1230db9ab688'),
      });
      await stockPrice.save();
    }
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
    let filter = {company: new Types.ObjectId(param)};
    const { from, to } = query;
    let fromDate;
    let toDate;
    if (from && to) {
      fromDate = new Date(from);
      toDate = new Date(to);
      filter = {
        ...filter,
        ...{timestamp: { $gte: fromDate, $lte: toDate}},
      };
    }
    const stockPrice = await this.stockDetailModel.find(filter)
    return stockPrice
  }
}
