import { ApiProperty } from "@nestjs/swagger";

export class StockDataQueryDTO {
    @ApiProperty({ required: false })
    id: string;
    @ApiProperty({ required: false })
    name: string;
  }