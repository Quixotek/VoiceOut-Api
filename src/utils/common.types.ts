import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { LegalResources } from 'src/legal-resources/legal-resources.schema';

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 1 })
  page: number;

  @Field(() => Number, { defaultValue: 10 })
  limit: number;

  @Field(() => String, { nullable: true })
  q?: string;
}

@ObjectType()
export class Meta {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  page: number;

  @Field(() => Number)
  limit: number;
}

@ObjectType()
export class LegalResourcesSearch {
  @Field(() => [LegalResources])
  item: LegalResources[];

  @Field(() => Meta)
  meta: Meta;
}
