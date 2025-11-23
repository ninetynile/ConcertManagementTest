import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' }
})
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    displayname: string;

    @Prop({ required: true })
    password: string;
    
}

export const UserSchema = SchemaFactory.createForClass(User);
    