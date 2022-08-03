import { MasterEntity } from 'src/stock_detail/entities/master.entity';
import { StockDetailEntity } from 'src/stock_detail/entities/stock_detal.entity';
import { DataSource } from 'typeorm';

const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: [MasterEntity, StockDetailEntity],
  ssl: {
    rejectUnauthorized: false,
  },
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  migrations: ['dist/src/db/migrations/*{.ts,.js}'],
});
dataSource.initialize().then(() => {
  {
    console.log('DataSource initialized');
  }
});
