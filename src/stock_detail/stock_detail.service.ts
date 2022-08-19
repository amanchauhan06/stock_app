import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvToJson from 'csvtojson';
import { Model, Types } from 'mongoose';
import { dataSource } from 'ormconfig';
import { distinct } from 'rxjs';
import { Repository } from 'typeorm';
import { StockDataQueryDTO } from './dto/stock_data.dto';
import { StockPriceQueryDTO } from './dto/stock_price.dto';
import { MasterAboutEntity } from './entities/master.about.entity';
import { MasterEntity } from './entities/master.entity';
import { MasterFundamentalsEntity } from './entities/master.fundamentals.entity';
import { MasterDocument } from './entities/master.model';
import { StockDetailEntity } from './entities/stock_detal.entity';
import { StockDetail, StockDetailDocument } from './stock_detail.model';

@Injectable()
export class StockDetailService {
  constructor(
    // @InjectModel('companyMasterData')
    // private readonly masterModel: Model<MasterDocument>,
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
      //   `/Users/amanchauhan/Desktop/archive/FullDataCsv/TATAMOTORS__EQ__NSE__NSE__MINUTE.csv`,
      `/Users/amanchauhan/Screenshots/stockData/FullDataCsv/IRCTC__EQ__NSE__NSE__MINUTE.csv`,
    );
    // for (let j = 101453; j < jsonArray.length; j++) {
    //   const stockPrice = new StockDetailEntity();
    //   stockPrice.timestamp = jsonArray[j].timestamp;
    //   stockPrice.open = jsonArray[j].open === '' ? 0 :parseInt(jsonArray[j].open);
    //   stockPrice.high =jsonArray[j].high === '' ?0: parseInt(jsonArray[j].high);
    //   stockPrice.low = jsonArray[j].low === '' ? 0 :parseInt(jsonArray[j].low);
    //   stockPrice.close = jsonArray[j].close === '' ? 0 :parseInt(jsonArray[j].close);
    //   stockPrice.volume = jsonArray[j].volume === '' ? 0 :parseInt(jsonArray[j].volume);
    //   stockPrice.company = '39372610-cdf3-4e71-98d6-a48465e2bb52';
    //   console.log(j);
    //   jsonArray[j].timestamp = new Date(jsonArray[j].timestamp).toISOString();
    // }
    await this.stockEntity
      .createQueryBuilder()
      .insert()
      .into(StockDetailEntity)
      .values(jsonArray)
      .execute();

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
    const stockData = await this.masterRepository.find(filter);
    return stockData;
  }

  async stockById(param: string, query: StockPriceQueryDTO) {
    // let filter = { company: param };
    const { duration } = query;
    let maxDate: Date;
    let minDate: Date;
    let timeInterval: number;
    let timePeriod: string;
    let dateTruncQuery: string;
    let startDate: string;
    if (duration) {
      maxDate = new Date('2020-10-12T09:00:00.000Z');
      switch (duration) {
        case 'day':
          timeInterval = 1;
          // timePeriod = 'minute';
          dateTruncQuery = `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / ${timeInterval} * interval '${timeInterval} min')`;
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'week':
          timeInterval = 5;
          // timePeriod = 'minute';
          dateTruncQuery = `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / ${timeInterval} * interval '${timeInterval} min')`;
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate() - 7,
          );
          break;
        case 'month':
          timeInterval = 30;
          // timePeriod = 'minute';
          dateTruncQuery = `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / ${timeInterval} * interval '${timeInterval} min')`;
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth() - 1,
            maxDate.getDate(),
          );
          break;
        case 'year':
          // timeInterval = 24 * 60;
          // timePeriod = 'day';
          dateTruncQuery = `date_trunc('day', timestamp)`;
          minDate = new Date(
            maxDate.getFullYear() - 1,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'three-year':
          // timeInterval = 3 * 24 * 60;
          // timePeriod = 'day';
          // dateTruncQuery = `date_trunc('day', timestamp) - interval '1 day' * (date_part('year', timestamp)::int % 3 + 1)`;
          minDate = new Date(
            maxDate.getFullYear() - 3,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 3)::int * 3) 
          `;
          break;
        case 'five-year':
          // timeInterval = 5 * 24 * 60;
          // timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 5,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 5)::int * 5) 
          `;
          break;
        default:
          timeInterval = 7 * 24 * 60;
          timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 10,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 7)::int * 7) 
          `;
          break;
      }

      // filter = {
      //   ...filter,
      //   ...{ timestamp: { $gt: minDate, $lte: maxDate } },
      // };
    }

    // var aggregationArray = [];
    // var project = {
    //   open: { $round: ['$open', 2] },
    //   high: { $round: ['$high', 2] },
    //   low: { $round: ['$low', 2] },
    //   close: { $round: ['$close', 2] },
    //   volume: { $round: ['$volume', 0] },
    //   company: { $toString: '$company' },
    // };

    // aggregationArray.push({ $match: filter });
    // if (duration != 'day') {
    //   aggregationArray.push({
    //     $group: {
    //       _id: {
    //         $dateTrunc: {
    //           date: '$timestamp',
    //           unit: timePeriod,
    //           binSize: timeInterval,
    //         },
    //       },
    //       open: { $first: '$open' },
    //       high: { $max: '$high' },
    //       low: { $min: '$low' },
    //       close: { $last: '$close' },
    //       volume: { $sum: '$volume' },
    //       company: { $first: '$company' },
    //     },
    //   });
    // } else {
    //   project['_id'] = '$timestamp';
    // }

    // aggregationArray.push(
    //   {
    //     $project: project,
    //   },
    //   { $sort: { _id: 1 } },
    // );

    // const stockPrice = dataSource.manager.query(
    //   `select (date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / 30 * interval '30 min') as t, count(timestamp), min(low) as low, max(high) as high, sum(volume) as volume, min(timestamp) as open_t, max(timestamp) as close_t  from stock_detail_entity where timestamp between '2020-10-12 00:00:00' and '2020-10-13 00:00:00' and "companyId"='39372610-cdf3-4e71-98d6-a48465e2bb52' group by t;`,
    // );
    const stockPrice = await dataSource
      .getRepository(StockDetailEntity)
      .createQueryBuilder('stock_detail_entity')
      .select([
        `${dateTruncQuery} as date_time`,
        `min(low) as low`,
        `max(high) as high`,
        `sum(volume) as volume`,
        `(array_agg(open))[1] as open`,
        `(array_agg(close))[count(close)] as close`,
      ])
      .where('"companyId" = :companyId', { companyId: param })
      .andWhere('timestamp >= :minDate', { minDate: minDate })
      .andWhere('timestamp <= :maxDate', { maxDate: maxDate })
      .groupBy('date_time')
      .orderBy('date_time', 'ASC')
      .getRawMany();

    // const stockPrice = await this.stockDetailModel.aggregate([
    //   ...aggregationArray,
    // ]);
    return stockPrice;
  }

  async candlestickStockPriceById(param: string, query: StockPriceQueryDTO) {
    // let filter = { company: new Types.ObjectId(param) };
    const { duration } = query;
    let maxDate: Date;
    let minDate: Date;
    let timeInterval: number;
    let timePeriod: string;
    let dateTruncQuery: string;
    let startDate: string;

    if (duration) {
      maxDate = new Date('2020-10-12T09:00:00.000Z');
      switch (duration) {
        case 'day':
          timeInterval = 5;
          dateTruncQuery = `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / ${timeInterval} * interval '${timeInterval} min')`;
          // timePeriod = 'minute';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          break;
        case 'week':
          timeInterval = 30;
          dateTruncQuery = `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / ${timeInterval} * interval '${timeInterval} min')`;
          // timePeriod = 'minute';
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate() - 7,
          );
          break;
        case 'month':
          timeInterval = 60;
          // timePeriod = 'hour';
          dateTruncQuery = `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / ${timeInterval} * interval '${timeInterval} min')`;
          minDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth() - 1,
            maxDate.getDate(),
          );
          
          break;
        case 'year':
          // timeInterval = 5;
          // timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 1,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 5)::int * 5) 
          `;
          break;
        case 'three-year':
          // timeInterval = 15;
          // timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 3,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 15)::int * 15) 
          `;
          break;
        case 'five-year':
          // timeInterval = 25;
          // timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 5,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 25)::int * 25) 
          `;
          break;
        default:
          // timeInterval = 25;
          // timePeriod = 'day';
          minDate = new Date(
            maxDate.getFullYear() - 10,
            maxDate.getMonth(),
            maxDate.getDate(),
          );
          startDate = `'${minDate
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')}'::date`;

          dateTruncQuery = `${startDate} + interval '1 day' * (((timestamp::Date - ${startDate}::Date) / 25)::int * 25) 
          `;
          break;
      }

      // filter = {
      //   ...filter,
      //   ...{ timestamp: { $gt: minDate, $lte: maxDate } },
      // };
    }

    // var aggregationArray = [];
    // var project = {
    //   open: { $round: ['$open', 2] },
    //   high: { $round: ['$high', 2] },
    //   low: { $round: ['$low', 2] },
    //   close: { $round: ['$close', 2] },
    //   volume: { $round: ['$volume', 0] },
    //   company: { $toString: '$company' },
    // };
    // aggregationArray.push({ $match: filter });
    // aggregationArray.push({
    //   $group: {
    //     _id: {
    //       $dateTrunc: {
    //         date: '$timestamp',
    //         unit: timePeriod,
    //         binSize: timeInterval,
    //       },
    //     },
    //     open: { $first: '$open' },
    //     high: { $max: '$high' },
    //     low: { $min: '$low' },
    //     close: { $last: '$close' },
    //     volume: { $sum: '$volume' },
    //     company: { $first: '$company' },
    //     date: { $push: '$timestamp' },
    //   },
    // });
    // aggregationArray.push(
    //   {
    //     $project: project,
    //   },
    //   { $sort: { _id: 1 } },
    // );

    const stockPrice = await dataSource
      .getRepository(StockDetailEntity)
      .createQueryBuilder('stock_detail_entity')
      .select([
        `${dateTruncQuery} as date_time`,
        `min(low) as low`,
        `max(high) as high`,
        `sum(volume) as volume`,
        `(array_agg(open))[1] as open`,
        `(array_agg(close))[count(close)] as close`,
      ])
      .where('"companyId" = :companyId', { companyId: param })
      .andWhere('timestamp >= :minDate', { minDate: minDate })
      .andWhere('timestamp <= :maxDate', { maxDate: maxDate })
      .groupBy('date_time')
      .orderBy('date_time', 'ASC')
      .getRawMany();

    // await this.stockDetailModel.aggregate([
    //   ...aggregationArray,
    // ]);
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
