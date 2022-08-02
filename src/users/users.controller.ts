import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt-strategy'))
  @Get(':id/')
  async getUser(@Param('id') id: string) {
    try {
      var { password, refreshToken, ...user } =
        await this.usersService.findOneById(id);
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
