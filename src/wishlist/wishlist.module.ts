import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entity/user.entity';
import { MasterEntity } from 'src/stock_detail/master.entity';
import { UserEntityCompaniesMaster } from './entities/user.entity.companies.master.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntityCompaniesMaster, UserEntity, MasterEntity]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService, UsersService],
})
export class WishlistModule {}
