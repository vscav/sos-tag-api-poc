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

@ObjectType()
class SimpleError {
  @Field()
  message: string;
}

@ObjectType()
class FieldError extends SimpleError {
  @Field()
  field: string;
}

@ObjectType()
class Errors {
  @Field(() => [FieldError], { nullable: true })
  errors?: (SimpleError | FieldError)[];
}

@ObjectType({ description: 'Boolean response' })
class BooleanResponse extends SingleObjectResponse(Boolean) {}

export { BooleanResponse, Errors, FieldError, ObjectsResponse, SimpleError, SingleObjectResponse };
