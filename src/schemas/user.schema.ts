import { Field, ID, ObjectType, Root } from 'type-graphql';

@ObjectType({ description: 'User Schema' })
class User {
  @Field(() => ID)
  _id: String;

  @Field()
  firstname: String;

  @Field()
  lastname: String;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstname} ${parent.lastname}`;
  }

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

export default User;
