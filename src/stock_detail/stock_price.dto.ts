import { ApiProperty } from '@nestjs/swagger';

export class StockPriceQueryDTO {
  // @ApiProperty({ required: false })
  // from: string;
  // @ApiProperty({ required: false })
  // to: string;
  @ApiProperty({ required: false })
  duration: string; // day, week, month, year, five-year
}
