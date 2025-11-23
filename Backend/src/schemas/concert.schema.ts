import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Reserve } from './reserve.schema';

@Schema({
  timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
})
export class Concert {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;
  
  @Prop({ required: true })
  ticket: number;

}

export const ConcertSchema = SchemaFactory.createForClass(Concert);
