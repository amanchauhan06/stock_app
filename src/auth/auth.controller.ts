import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { LocalAuthGuard } from './passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res): Promise<any> {
    const token = await this.authService.login(req.user);
    return res.status(200).json({
      msg: 'Login successful',
      user: req.user,
      ...token,
    });
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Response() res): Promise<any> {
    try {
      const token = await this.authService.register(body);
      const {password, ...user} = body;
      return res.status(201).json({
        msg: 'Registration successful',
        user: user,
        ...token,
      });
    } catch (error) {
      return res.status(400).json({
        msg: error.message,
      });
    }
  }

  @UseGuards(AuthGuard('refresh-token-strategy'))
  @Get('refreshToken')
  async refreshToken(@Request() req, @Response() res): Promise<any> {
    const token = await this.authService.refreshToken(
      req.user.id,
      req.headers.authorization.replace('Bearer ', '').trim(),
    );
    return res.status(200).json({
      msg: 'Refresh Token successful',
      user: req.user,
      ...token,
    });
  }

  // @UseGuards(AuthGuard('jwt-strategy'))
  // @Get('me')
  // async me(@Request() req, @Response() res): Promise<any> {
  //   return res.status(200).json({
  //     msg: 'hello world',
  //   });
  // }
}
