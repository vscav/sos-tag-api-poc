import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Paginator input' })
class PaginatorInput {
  @Field()
  page: number;
  @Field()
  limit: number;
}

export { PaginatorInput };
