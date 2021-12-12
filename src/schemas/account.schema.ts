import { Field, ID, Int, ObjectType } from 'type-graphql';
import UserSchema from './user.schema';

@ObjectType({ description: 'Account Schema' })
class Account {
  @Field(() => ID)
  _id: String;

  @Field()
  firstname: String;

  @Field()
  lastname: String;

  @Field()
  email: String;

  @Field()
  phone: String;

  @Field()
  password: String;

  @Field(() => [UserSchema])
  users: [String];

  @Field(() => Int, { defaultValue: 0 })
  tokenVersion: Number;

  @Field(() => Boolean, { defaultValue: false })
  confirmed: boolean;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

export default Account;
