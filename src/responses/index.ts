import { ClassType, Field, ObjectType } from 'type-graphql';

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

@ObjectType({ description: 'Error with message' })
class SimpleError {
  @Field()
  message: string;
}

@ObjectType({ description: 'Error with message and the field associated' })
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

export { BooleanResponse, Errors, FieldError, ObjectsResponse, SimpleError, SingleObjectResponse };
