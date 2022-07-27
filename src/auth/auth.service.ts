import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const tokens = await this.updateRefreshTokenHash(user);
    return tokens;
  }

  async refreshToken(userId: number, refreshToken: string) {
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

  async register(user: RegisterDto) {
    // const hashedPassword = await this.hashData(user.password); //TODO: save hashed password in db
    const rawUser = {
      id: randomInt(10, 100),
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      username: user.username,
      password: user.password,
      // password: hashedPassword,
      refreshToken: '',
    };
    const userAlreadyExists = await this.userService.findOne(user.username);
    if (userAlreadyExists) {
      throw new Error("User already exists");
      
    }
    this.userService.create(rawUser);
    const tokens = await this.updateRefreshTokenHash(rawUser);
    return tokens;
  }

  async updateRefreshTokenHash(user: any) {
    const tokens = await this.getTokens(user);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    this.userService.updateUserRefreshTokenHash(user, hashedRefreshToken);
    return tokens;
  }

  async getTokens(user: any) {
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
