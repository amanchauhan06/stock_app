import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dataSource } from 'ormconfig';
import { UserDto } from 'src/auth/dto';
import { MasterEntity } from 'src/stock_detail/entities/master.entity';
import { getConnection, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async create(userDto: UserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = userDto.name;
    user.email = userDto.email;
    user.mobile = userDto.mobile;
    user.username = userDto.username;
    user.password = userDto.password;
    user.refreshToken = userDto.refreshToken;
    return await this.userRepository.save(user);
  }

  async findOneByUserName(userName: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { username: userName } });
  }

  async findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async updateUserRefreshTokenHash(
    user: UserEntity,
    refreshToken: string,
  ): Promise<any> {
    return await this.userRepository.update(user.id, {
      refreshToken: refreshToken,
    });
  }
}
