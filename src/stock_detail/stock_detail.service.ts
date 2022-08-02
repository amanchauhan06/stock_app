import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvToJson from 'csvtojson';
import { Model, Types } from 'mongoose';
import { dataSource } from 'ormconfig';
import { Repository } from 'typeorm';
import { MasterAboutEntity } from './entities/master.about.entity';
import { MasterEntity } from './entities/master.entity';
import { MasterFundamentalsEntity } from './entities/master.fundamentals.entity';
import { MasterDocument } from './entities/master.model';
import { StockDetailDocument } from './stock_detail.model';

@Injectable()
export class StockDetailService {
  constructor(
    @InjectModel('companyMasterData')
    private readonly masterModel: Model<MasterDocument>,
    @InjectModel('stockDetail')
    private readonly stockDetailModel: Model<StockDetailDocument>,
    @InjectRepository(MasterEntity)
    private readonly masterRepository: Repository<MasterEntity>,
    @InjectRepository(MasterFundamentalsEntity)
    private readonly masterFundamentalsEntity: Repository<MasterFundamentalsEntity>,
    @InjectRepository(MasterAboutEntity)
    private readonly masterAboutEntity: Repository<MasterAboutEntity>,
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

  async addStockFundamentals(id: string) {
    var company = await this.masterRepository.findOneBy({ id: id });
    var fundamental = new MasterFundamentalsEntity();
    fundamental.marketCap = '51352';
    fundamental.roe = '39.75';
    fundamental.peRatio = '77.5';
    fundamental.pbRatio = '1.5';
    fundamental.eps = '8.25';
    fundamental.debtToEquity = '0.07';
    fundamental.industryPE = '0.5';
    fundamental.bookValue = '23.55';
    fundamental.faceValue = '2';
    fundamental.dividendYield = '0.39';
    fundamental.company = company;
    return await this.masterFundamentalsEntity.save(fundamental);
  }

  async addAboutStock(id: string) {
    var company = await this.masterRepository.findOneBy({ id: id });
    var about = new MasterAboutEntity();
    about.description =
      'Indian Railway Catering and Tourism Corporation (IRCTC) is an Indian public sector undertaking that provides ticketing, catering, and tourism services for the Indian Railways. It was initially wholly owned by the Government of India and operated under the administrative control of the Ministry of Railways, but has been listed on the National Stock Exchange since 2019, with the Government continuing to hold majority ownership';
    about.parent = 'Indian Railway Catering & Tourism Corporation';
    about.founded = '1999';
    about.managingDirector = 'Smt. Rajni Hasija';
    about.company = company;
    return await this.masterAboutEntity.save(about);
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

  async getStockFundamentals(id: string) {
    return await dataSource.getRepository(MasterFundamentalsEntity).find({
      relations: {
        company: true,
      },
    });
  }

  async getAboutStock(id: string) {
    return await dataSource.getRepository(MasterAboutEntity).find({
      relations: {
        company: true,
      },
    });
  }
}
