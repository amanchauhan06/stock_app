import { ApiProperty } from "@nestjs/swagger";

export class OrderDto {
    @ApiProperty({ required: true })
    price: number;
    @ApiProperty({ required: true })
    quantity: number;
    @ApiProperty({ required: true })
    tradedQuantity: number;
    @ApiProperty({ required: true })
    company: string;
    @ApiProperty({ required: true })
    userId: string;
    @ApiProperty({ required: true })
    orderTpe: string;
}