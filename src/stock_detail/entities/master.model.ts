import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MasterDocument = Master & Document;

@Schema()
export class Master {
  @Prop()
  tradingsymbol: String;
  @Prop()
  name: String;
  @Prop()
  instrument_type: String;
  @Prop()
  segment: String;
  @Prop()
  exchange: String;
  @Prop()
  data_type: String;
  @Prop()
  key: String;
  @Prop()
  from: String;
  @Prop()
  to: String;
}

export const MasterSchema = SchemaFactory.createForClass(Master);
