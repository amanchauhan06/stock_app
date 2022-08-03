import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entity/user.entity';
import { UserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: UserEntity = await this.userService.findOneByUserName(username);
    if (user && user.password === password) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    const tokens = await this.updateRefreshTokenHash(user);
    return tokens;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await bcrypt.compare(refreshToken, user.refreshToken, (err, res) => {
      if (err) {
        throw new Error('Refresh token is invalid');
      }
      return res;
    });
    const tokens = await this.updateRefreshTokenHash(user);
    return tokens;
  }

  async register(user: UserDto) {
    // const hashedPassword = await this.hashData(user.password); //TODO: save hashed password in db
    const userAlreadyExists = await this.userService.findOneByUserName(
      user.username,
    );
    if (userAlreadyExists) {
      throw new Error('User already exists');
    }
    const userEntityResponse = await this.userService.create(user);
    const tokens = await this.updateRefreshTokenHash(userEntityResponse);
    return tokens;
  }

  async updateRefreshTokenHash(user: UserEntity) {
    const tokens = await this.getTokens(user);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.userService.updateUserRefreshTokenHash(user, hashedRefreshToken);
    return tokens;
  }

  async getTokens(user: UserEntity) {
    const payload = {
      sub: user.id,
      username: user.username,
    };
    const [accessToken, refreshToken] = await Promise.all<any>([
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_SECRET_EXPIRES,
        secret: process.env.JWT_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: process.env.REFRESH_SECRET_EXPIRES,
        secret: process.env.REFRESH_TOKEN_SECRET,
      }),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }  

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
