import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

enum OrderType {
  buy,
  sell,
}

enum OrderStatus {
  pending,
  partiallyFilled,
  completed,
}

export type ExchangeOrderDocument = ExchangeOrderRequestDTO & Document;

@Schema()
export class ExchangeOrderRequestDTO {
  @ApiProperty({ required: false })
  @Prop()
  price: number;
  @ApiProperty({ required: false })
  @Prop()
  quantity: number;
  @ApiProperty({ required: false })
  @Prop()
  company: number;
  @ApiProperty({ required: false })
  @Prop()
  orderTpe: OrderType;
  @ApiProperty({ required: false })
  @Prop()
  trades: Array<Trade>;
  @ApiProperty({ required: false, default: OrderStatus.pending })
  @Prop()
  orderStatus: OrderStatus;
}

export const ExchangeOrderRequestSchema = SchemaFactory.createForClass(
  ExchangeOrderRequestDTO,
);
