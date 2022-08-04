import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvToJson from 'csvtojson';
import { Model, Types } from 'mongoose';
import { dataSource } from 'ormconfig';
import { Repository } from 'typeorm';
import { StockDataQueryDTO } from './dto/stock_data.dto';
import { StockPriceQueryDTO } from './dto/stock_price.dto';
import { MasterAboutEntity } from './entities/master.about.entity';
import { MasterEntity } from './entities/master.entity';
import { MasterFundamentalsEntity } from './entities/master.fundamentals.entity';
import { MasterDocument } from './entities/master.model';
import { StockDetailEntity } from './entities/stock_detal.entity';
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
    @InjectRepository(StockDetailEntity)
    private readonly stockEntity: Repository<StockDetailEntity>,
  ) {}

  async migrateData() {
    const jsonArray = await csvToJson().fromFile(
      `/Users/amanchauhan/Screenshots/stockData/FullDataCsv/MRF__EQ__NSE__NSE__MINUTE.csv`,
    );
 
    let stockData : StockDetailEntity[] = [];

    let company = await this.masterRepository.findOneBy({
      id: '52874e78-a1bc-46d7-a0e9-7813efaaf8f9',
    });

    for (let j = 2; j < jsonArray.length; j++) {
      console.log(jsonArray[j]);
      const stockPrice = new StockDetailEntity();
      stockPrice.timestamp = jsonArray[j].timestamp;
      stockPrice.open = jsonArray[j].open === '' ? 0 : jsonArray[j].open;
      stockPrice.high = jsonArray[j].high === '' ? 0 : jsonArray[j].high;
      stockPrice.low = jsonArray[j].low === '' ? 0 : jsonArray[j].low;
      stockPrice.close = jsonArray[j].close === '' ? 0 : jsonArray[j].close;
      stockPrice.volume =
        jsonArray[j].volume === '' ? 0 : parseInt(jsonArray[j].volume);
      stockPrice.company = company;
      jsonArray[j].timestamp = new Date(jsonArray[j].timestamp).toISOString();
      stockData.push(stockPrice);
    }
    await this.stockEntity.save(stockData, { chunk: 1000 });
    
    /* Migration For the Master CSV */

    // const jsonArray = await csvToJson().fromFile(
      //   `/Users/amanchauhan/Desktop/archive/FullDataCsv/TATAMOTORS__EQ__NSE__NSE__MINUTE.csv`,
    //   `/Users/amanchauhan/Screenshots/stockData/FullDataCsv/master.csv`,
    // );
    // for (let j = 0; j <jsonArray.length ; j++) {
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

  async stocks(query: StockDataQueryDTO) {
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

  async stockById(param: string, query: StockPriceQueryDTO) {
    let filter = { company: new Types.ObjectId(param) };
    const { duration } = query;
    let maxDate: Date;
    let minDate: Date;
    let timeInterval: number;
    let timePeriod: string;
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

  async candlestickStockPriceById(param: string, query: StockPriceQueryDTO) {
    let filter = { company: new Types.ObjectId(param) };
    const { duration } = query;
    let maxDate: Date;
    let minDate: Date;
    let timeInterval: number;
    let timePeriod: string;
    if (duration) {
      maxDate = new Date('2020-10-12T09:00:00.000Z');
      switch (duration) {
        case 'day':
          timeInterval = 5;
          timePeriod = 'minute';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'week':
          timeInterval = 30;
          timePeriod = 'minute';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate() - 7,
          );
          break;
        case 'month':
          timeInterval = 2;
          timePeriod = 'hour';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth() - 1,
            maxDate.getDate(),
          );
          break;
        case 'year':
          timeInterval = 5;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 1,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'three-year':
          timeInterval = 15;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 3,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'five-year':
          timeInterval = 25;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 5,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        default:
          timeInterval = 25;
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
        date: { $push: '$timestamp' },
      },
    });
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
