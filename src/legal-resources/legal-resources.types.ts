import { Field, InputType, PartialType } from '@nestjs/graphql';
import { PaginationInput } from '../utils/common.types';

@InputType()
export class LegalResourcesCreateInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  category: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: false })
  source: string;

  @Field(() => String, { nullable: false })
  url: string;

  @Field(() => String, { nullable: false })
  notes?: string;
}

@InputType()
export class LegalResourcesUpdateInput extends PartialType(
  LegalResourcesCreateInput,
) {}

@InputType()
export class LegalResourcesPaginationInput extends PaginationInput {}
