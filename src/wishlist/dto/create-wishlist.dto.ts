import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  @ApiProperty({ required: true })
  id: string;
}
