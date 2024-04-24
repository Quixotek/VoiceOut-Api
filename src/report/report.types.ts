import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class ReportCreateInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  type: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  description: string;

  @IsOptional()
  @IsString({ each: true })
  @Field(() => [String], { nullable: 'itemsAndList' })
  locations?: string[];

  @IsOptional()
  @IsString({ each: true })
  @Field(() => [String], { nullable: 'itemsAndList' })
  attachments?: string[];

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isReviewed?: boolean;
}

@InputType()
export class ReportUpdateInput extends PartialType(ReportCreateInput) {
  @IsString()
  @IsNotEmpty()
  id: string;
}
