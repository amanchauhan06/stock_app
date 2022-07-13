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
    const allCompanies = await this.masterModel.find({});
    for (let index = 0; index < allCompanies.length; index++) {
      const jsonArray = await csvToJson().fromFile(
        `/Users/amanchauhan/Desktop/archive/FullDataCsv/${allCompanies[index].key}.csv`,
      );
      for (let j = 0; j < jsonArray.length; j++) {
        jsonArray[j].timestamp = new Date(jsonArray[j].timestamp).toISOString();
        const stockPrice = new this.stockDetailModel({
          ...jsonArray[j],
          company: allCompanies[index]._id,
        });
        await stockPrice.save();
        console.log(j);
      }
    }
  }

  public stocks(query) {
    const {id, name } = query;
    let filter = {};
    if (name) {
    const regExp = new RegExp(name, 'i');
      filter = {
        ...{name: regExp},
      }
    }
    if(id){
      filter = {
        ...filter,
        ...{company: new Types.ObjectId(id)},
      }
    }
    return this.masterModel.find(filter);
  }

  public stockById(param, query) {
    let filter = { company: new Types.ObjectId(param.id) };
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
    return this.stockDetailModel.find(filter);
  }
}
