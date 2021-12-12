import { isAuth } from '@middlewares/is-auth.middleware';
import UserSchema from '@schemas/user.schema';
import UserService from '@services/user.service';
import { logger } from '@utils/logger';
import { Arg, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { ObjectsResponse, SingleObjectResponse } from '@responses';

@ObjectType({ description: 'User response' })
class UserResponse extends SingleObjectResponse(UserSchema) {}

@ObjectType({ description: 'Users response' })
class UsersResponse extends ObjectsResponse(UserSchema) {}

@Service()
@Resolver(() => UserSchema)
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async userByID(@Arg('userId') userId: string): Promise<UserResponse> {
    try {
      const user = await this.userService.findUserById(userId);
      return user;
    } catch (error) {
      logger.error(`[resolver:User:userByID] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async users(): Promise<UserResponse> {
    try {
      const users = await this.userService.findUsers();
      return users;
    } catch (error) {
      logger.error(`[resolver:User:users] ${error.message}.`);
      throw error;
    }
  }
}

export { UserResponse, UsersResponse };
export default UserResolver;
