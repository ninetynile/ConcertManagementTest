import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ReserveTrn {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  concertId: string;

  @Prop({ required: true })
  concertTitle: string;

  @Prop({ required: true })
  action: string;   // 'reserve' | 'cancel'

  @Prop({ default: Date.now })
  createDate: Date;
}

export const ReserveTrnSchema = SchemaFactory.createForClass(ReserveTrn);
