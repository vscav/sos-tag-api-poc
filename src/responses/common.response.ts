import { ClassType, Field, Int, ObjectType } from 'type-graphql';

const SingleObjectResponse = <T>(TItemSchema: ClassType<T>): any => {
  @ObjectType({ description: 'Generic single object response', isAbstract: true })
  abstract class GenericSingleObjectResponse extends Errors {
    @Field(() => TItemSchema, { nullable: true })
    response?: T;
  }

  return GenericSingleObjectResponse;
};

const ObjectsResponse = <T>(TItemSchema: ClassType<T>): any => {
  @ObjectType({ description: 'Generic multiple objects response', isAbstract: true })
  abstract class GenericObjectsResponse extends Errors {
    @Field(() => [TItemSchema], { nullable: true })
    response?: T[];
  }

  return GenericObjectsResponse;
};

const PaginatedResponse = <T>(TItemClass: ClassType<T>): any => {
  @ObjectType({ description: 'Generic paginated response', isAbstract: true })
  abstract class GenericPaginatedResponse extends Errors {
    @Field(() => [TItemClass])
    items: T[];
    @Field(() => Int)
    currentPage: number;
    @Field(() => Int)
    totalPages: number;
    @Field()
    hasMore: boolean;
  }

  return GenericPaginatedResponse;
};

@ObjectType({ description: 'Error with message' })
class SimpleError {
  @Field()
  message: string;
}

@ObjectType({ description: 'Error with message and the associated field' })
class FieldError extends SimpleError {
  @Field()
  field: string;
}

@ObjectType({ description: 'Errors (simple or with field)' })
class Errors {
  @Field(() => [FieldError], { nullable: true })
  errors?: (SimpleError | FieldError)[];
}

@ObjectType({ description: 'Boolean response' })
class BooleanResponse extends SingleObjectResponse(Boolean) {}

export { BooleanResponse, Errors, FieldError, ObjectsResponse, PaginatedResponse, SimpleError, SingleObjectResponse };
