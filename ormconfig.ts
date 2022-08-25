import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  autoLoadEntities: true,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  migrations: ['dist/src/stock_detail/migrations/*{.ts,.js}'],
  logging: true,
};

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: [
    'dist/src/stock_detail/entities/**/*{.ts,.js}',
    'dist/src/users/**/*{.ts,.js}',
    'dist/src/wishlist/**/*{.ts,.js}',
  ],
  database: 'postgres',
  synchronize: false,
  migrations: ['dist/src/stock_detail/migrations/*{.ts,.js}'],
  logging: true,
});
dataSource.initialize().then(() => {
  {
  }
});
