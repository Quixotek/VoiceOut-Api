import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from 'src/utils/common.types';

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

  @Field(() => String)
  url: string;

  @Field(() => String)
  notes: string;
}

@InputType()
export class LegalResourcesUpdateInput extends LegalResourcesCreateInput {}

@InputType()
export class LegalResourcesPaginationInput extends PaginationInput {}
