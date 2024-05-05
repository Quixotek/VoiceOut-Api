import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
import { Document } from 'mongoose';

export type ReportDocument = Report & Document;

@ObjectType('Report')
@Schema({ timestamps: true })
export class Report {
  @Field(() => ID)
  @Prop({ required: true, unique: true, default: v4 })
  id: string;

  @Field(() => String)
  @Prop({ required: true })
  type: string;

  @Field(() => String)
  @Prop({ required: true })
  description: string;

  /**
   * Optional fields for the report
   * It will help to provide more information about the report
   * for the data visualization feature in phase 2 of anonymous-reporting feature
   * this fields will only used if the user opt in to provide more information
   */
  @Field(() => String, { nullable: true })
  @Prop({ required: false })
  locations?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @Prop({ required: false })
  attachments?: string[];

  /**
   * This field will be used to determine if the report has been reviewed
   * by admins or moderators for a community post
   */
  @Field(() => Boolean, { nullable: true })
  @Prop({ default: false })
  isReviewed: boolean;

  @Field(() => Date)
  @Prop()
  createdAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
