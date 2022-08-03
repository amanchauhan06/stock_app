import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

export const ormConfigTimeScale: TypeOrmModuleOptions = {
    type: 'postgres',
    name: 'timeScale',
    host: process.env.TIMESCALE_URL,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.TIMESCALE_PASSWORD,
    entities: [
        'dist/src/exchange_order/entities/**/*{.ts,.js}',
      ],
    database: process.env.TIMESCALE_DATABASE,
    synchronize: true,
    migrations: ['dist/src/exchange_order/migrations/*{.ts,.js}'],
  };
  
  export const dataSource: DataSource = new DataSource({
    type: 'postgres',
    name: 'timeScale',
    host: process.env.TIMESCALE_URL,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.TIMESCALE_PASSWORD,
    entities: [
      'dist/src/exchange_order/entities/**/*{.ts,.js}',
    ],
    database: process.env.TIMESCALE_DATABASE,
    synchronize: false,
    migrations: ['dist/src/exchange_order/migrations/*{.ts,.js}'],
  });
  dataSource.initialize().then(() => {
    {
      console.log('TimeSeries DataSource initialized');
    }
  });