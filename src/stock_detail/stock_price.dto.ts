import { ApiProperty } from '@nestjs/swagger';

export class StockPriceQueryDTO {
  @ApiProperty({ required: false })
  from: string;
  @ApiProperty({ required: false })
  to: string;
}
