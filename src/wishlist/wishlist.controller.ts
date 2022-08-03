import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(AuthGuard('jwt-strategy'))
  @Post()
  async create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    try {
      await this.wishlistService.addWishlist(createWishlistDto, req.user.id);
      return {
        status: 'success',
        message: 'Added to wishlist',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt-strategy'))
  @Get()
  async findAll(@Request() req) {
    try {
      var wishlist = await this.wishlistService.getWishlist(req.user.id);
      return {
        status: 'success',
        data: wishlist,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @UseGuards(AuthGuard('jwt-strategy'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') stockId: string) {
    try {
      await this.wishlistService.removeWishlist(stockId, req.user.id);
      return {
        status: 'success',
        message: 'Removed from wishlist',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}
