import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StockDetailDocument = StockDetail & Document;

@Schema()
export class StockDetail {
    @Prop()
    timestamp: Date;
    @Prop()
    open: Number;
    @Prop()
    high: Number;
    @Prop()
    low: Number;
    @Prop()
    close: Number;
    @Prop()
    volume: Number;
    @Prop({type: Types.ObjectId, ref: "companyMasterData"})
    company
}

export const StockDetailSchema = SchemaFactory.createForClass(StockDetail);
