import {
  Controller,
  Get,
  Inject,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'To get profile of a particular user.' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully',
  })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Get('profile')
  @ApiBearerAuth('defaultBearerAuth')
  async getUser(@Request() req) {
    try {
      var { password, refreshToken, ...user } =
        await this.usersService.findOneById(req.user.id);
      return {
        status: 'success',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}
