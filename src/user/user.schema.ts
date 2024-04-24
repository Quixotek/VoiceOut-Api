import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Prop({ required: true, default: v4 })
  @Field(() => ID)
  id: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
