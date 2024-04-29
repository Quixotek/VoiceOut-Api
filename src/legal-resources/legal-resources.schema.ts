import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

@Schema({ timestamps: true })
@ObjectType()
export class LegalResources {
  @Field(() => ID)
  @Prop({ required: true, default: v4 })
  id: string;

  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop({ required: true })
  description: string;

  @Field(() => String)
  @Prop({ required: true })
  category: string; // A categorrization or tagging system to classify the legal resource by topic area of law (e.g., "Family Law", "Criminal Law",)

  @Field(() => String)
  @Prop({ required: true })
  type: string; //Indicate the type of legal resource, such as statutes, case law, regulations, legal articles, legal forms, practice guides, legal encyclopedias, etc

  @Field(() => String)
  @Prop({ required: true })
  source: string; // The original source of t he legal resource, including the name of the publication or website where it was found.

  @Field(() => Date)
  @Prop({ required: true })
  publicationDate: Date;

  @Field(() => String)
  @Prop({ required: true })
  author: string;

  @Field(() => String)
  @Prop({ required: false })
  url: string; // Optional  If the legal resource is available online, include the URL or location where users can access it.

  @Field(() => Boolean)
  @Prop({ required: true, default: false })
  verified: boolean; // Optional  If the legal resource has been verified by the platform administrators, set this field to true.

  @Field(() => String)
  @Prop({ required: false })
  notes: string; // Optional  Any additional notes or comments about the legal resource that may be helpful to users or administrators.
}

export type LegalResourcesDocument = LegalResources & Document;
export const LegalResourcesSchema =
  SchemaFactory.createForClass(LegalResources);
