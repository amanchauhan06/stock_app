import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dataSource } from 'ormconfig';
import { MasterEntity } from 'src/stock_detail/master.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersService: UsersService,
    @InjectRepository(MasterEntity)
    private readonly masterRepository: Repository<MasterEntity>,
  ) {}

  async addWishlist(
    createWishlistDto: CreateWishlistDto,
    userId: string,
  ): Promise<any> {
    var company = await this.masterRepository.findOneBy({
      id: createWishlistDto.id,
    });
    return await dataSource
      .createQueryBuilder()
      .relation(UserEntity, 'companies')
      .of(userId)
      .add(company);
  }
  async getWishlist(userId: string) {
    return await dataSource
      .createQueryBuilder()
      .relation(UserEntity, 'companies')
      .of(userId)
      .loadMany();
  }

  async removeWishlist(stockId: string, userId: string): Promise<any> {
    var company = await this.masterRepository.findOneBy({ id: stockId });
    return await dataSource
      .createQueryBuilder()
      .relation(UserEntity, 'companies')
      .of(userId)
      .remove(company);
  }
}
