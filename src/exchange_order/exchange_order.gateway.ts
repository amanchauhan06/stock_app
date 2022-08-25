import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, WebSocketGateway } from '@nestjs/websockets';
import Redis from 'ioredis';
import { dataSource } from 'ormconfig';
import { Socket } from 'socket.io';
import { StockDetailEntity } from 'src/stock_detail/entities/stock_detal.entity';
import { MoreThan, Repository } from 'typeorm';
import { stock_order } from './constants/constants';
import { ExchangeOrderService } from './exchange_order.service';
export type MySocket = Socket & { nickname: string };

@WebSocketGateway({ cors: true })
export class ExchangeOrderGateway {
  constructor(
    @Inject('MATCHING_SERVICE') private readonly matchingService: ClientProxy,
    @Inject('REDIS_CLIENT2') private readonly redis: Redis,
    private readonly exchangeOrderService: ExchangeOrderService,
    @InjectRepository(StockDetailEntity)
    private readonly stockEntity: Repository<StockDetailEntity>,
  ) {}

  handleConnection(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket.id} ] connected`);
    socket.on('getPrice', async (data) => {
      var date = new Date();
      var startTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        9,
        30,
        0,
      );
      var endTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        15,
        30,
        0,
      );
      if (date < startTime || date > endTime) {
        if (date < startTime) {
          socket.emit('error', { message: 'Market is not yet opened' });
        } else {
          socket.emit('error', {
            message: 'Market is closed, Please come back tomorrow',
          });
        }
      } else {
        setInterval(async () => {
          const date = new Date();
          const minDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes() - 1,
          );
          const jsonData = JSON.parse(data);
          // console.log(jsonData['company'][0]);
          for (let i = 0; i < jsonData.company.length; i++) {
            let price = await dataSource
              .getRepository(StockDetailEntity)
              .createQueryBuilder()
              .select([
                // 'id as id',
                'timestamp as date_time',
                'open as open',
                'high as high',
                'low as low',
                'close as close',
                'volume as volume',
              ])
              .where('"companyId" = :companyId', {
                companyId: jsonData['company'][i],
              })
              .andWhere('timestamp = :minDate', { minDate: minDate })
              .getRawMany();
            let candleStickPrice = await dataSource
              .getRepository(StockDetailEntity)
              .createQueryBuilder('stock_detail_entity')
              .select([
                `(date_trunc('hour', timestamp) + date_part('minute', timestamp)::int / 5 * interval '5 min') as date_time`,
                `min(low) as low`,
                `max(high) as high`,
                `sum(volume) as volume`,
                `(array_agg(open))[1] as open`,
                `(array_agg(close))[count(close)] as close`,
              ])
              .where('"companyId" = :companyId', {
                companyId: jsonData['company'][i],
              })
              .andWhere('timestamp >= :minDate', { minDate: minDate })
              .groupBy('date_time')
              .orderBy('date_time', 'ASC')
              .getRawMany();
            // console.log(candleStickPrice);
            socket.emit('TATAMOTORS_price', {
              line_graph: price,
              candle_stick: candleStickPrice,
            });
            // this.redis.subscribe(
            //   stock_order[`${jsonData['company'][i]}_PUB`],
            //   (data) => {
            //     this.exchangeOrderService.createOrder(data);
            //     console.log(`${jsonData['company'][i]}_price`);
            //     socket.emit(`${jsonData['company'][i]}_price`, data);
            //   },
            // );
          }
        }, 60000);
      }
      // this.redis.subscribe(stock_order[`${jsonData['company']}_PUB`], (data) => {
      //   this.exchangeOrderService.createOrder(data);
      //   console.log(`${jsonData['company']}_price`);
      //   socket.emit(`${jsonData['company']}_price`, data);
      // });
    });
  }
  async handleDisconnect(@ConnectedSocket() socket: MySocket) {
    console.log(`[ ${socket?.nickname ?? socket.id} ] disconnected`);
  }
}
