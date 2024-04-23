import { InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class ReportCreateInput {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  isReviewed?: boolean;
}

@InputType()
export class ReportUpdateInput extends PartialType(ReportCreateInput) {}
