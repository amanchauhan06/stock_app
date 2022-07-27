import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token-strategy') {
  constructor() {
    super({
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // passRequestToCallback: true,
    });
  }
  async validate(payload: any) {
    // const refreshToken = req.get('authorization').replace('Bearer ', '').trim();
    return {
      id: payload.sub,
      username: payload.username,
      // refreshToken: refreshToken,
    };
  }
}
