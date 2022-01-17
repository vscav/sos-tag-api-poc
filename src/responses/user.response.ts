import UserSchema from '@schemas/user.schema';
import { ObjectType } from 'type-graphql';
import { ObjectsResponse, SingleObjectResponse } from './common.response';

@ObjectType({ description: 'User response' })
class UserResponse extends SingleObjectResponse(UserSchema) {}

@ObjectType({ description: 'Users response' })
class UsersResponse extends ObjectsResponse(UserSchema) {}

export { UserResponse, UsersResponse };
