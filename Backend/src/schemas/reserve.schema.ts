import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
})
export class Reserve {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Concert' })
    concertId: string;
    
}

export const ReserveSchema = SchemaFactory.createForClass(Reserve);

// 👇 Add this line for composite unique index
ReserveSchema.index({ userId: 1, concertId: 1 }, { unique: true });