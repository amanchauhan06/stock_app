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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiOperation({ summary: 'To add a particular stock to wishlist.' })
  @ApiResponse({
    status: 201,
    description: 'Added to wishlist successfully',
  })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Post()
  @ApiBearerAuth('defaultBearerAuth')
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

  @ApiOperation({ summary: 'To get the all wishlisted stocks.' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist fetched successfully',
  })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Get()
  @ApiBearerAuth('defaultBearerAuth')
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

  @ApiOperation({ summary: 'To remove a particular stock from wishlist.' })
  @ApiResponse({
    status: 200,
    description: 'Removed stock from wishlist fetched successfully',
  })
  @UseGuards(AuthGuard('jwt-strategy'))
  @Delete(':id')
  @ApiBearerAuth('defaultBearerAuth')
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
