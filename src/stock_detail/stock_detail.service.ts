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
    let filter = { company: new Types.ObjectId(param) };
    const { duration } = query;
    let maxDate;
    let minDate;
    let timeInterval;
    let timePeriod;
    if (duration) {
      maxDate = new Date('2020-10-12T09:00:00.000Z');
      switch (duration) {
        case 'day':
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'week':
          timeInterval = 5;
          timePeriod = 'minute';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate() - 7,
          );
          break;
        case 'month':
          timeInterval = 30;
          timePeriod = 'minute';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth() - 1,
            maxDate.getDate(),
          );
          break;
        case 'year':
          timeInterval = 1;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 1,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'three-year':
          timeInterval = 3;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 3,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'five-year':
          timeInterval = 5;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 5,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        default:
          timeInterval = 7;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 10,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
      }

      filter = {
        ...filter,
        ...{ timestamp: { $gt: minDate, $lte: maxDate } },
      };
    }

    console.log('this is the filter', filter);

    var aggregationArray = [];
    var project = {
      open: { $round: ['$open', 2] },
      high: { $round: ['$high', 2] },
      low: { $round: ['$low', 2] },
      close: { $round: ['$close', 2] },
      volume: { $round: ['$volume', 0] },
      company: { $toString: '$company' },
    };

    aggregationArray.push({ $match: filter });
    if (duration != 'day') {
      aggregationArray.push({
        $group: {
          _id: {
            $dateTrunc: {
              date: '$timestamp',
              unit: timePeriod,
              binSize: timeInterval,
            },
          },
          open: { $first: '$open' },
          high: { $max: '$high' },
          low: { $min: '$low' },
          close: { $last: '$close' },
          volume: { $sum: '$volume' },
          company: { $first: '$company' },
        },
      });
    } else {
      project['_id'] = '$timestamp';
    }

    aggregationArray.push(
      {
        $project: project,
      },
      { $sort: { _id: 1 } },
    );
    const stockPrice = await this.stockDetailModel.aggregate([
      ...aggregationArray,
    ]);
    return stockPrice;
  }
}
