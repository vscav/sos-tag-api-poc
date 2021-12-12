import { isAuth } from '@middlewares/is-auth.middleware';
import { IUser } from '@models/user.model';
import UserSchema from '@schemas/user.schema';
import UserService from '@services/user.service';
import { logger } from '@utils/logger';
import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { transformUser } from './utils/transform';

// @ObjectType({ description: 'User response' })
// class UserResponse {
//   @Field(() => UserSchema)
//   data: UserSchema | null;
//   @Field(() => String)
//   error: String | null;
// }

@Service()
@Resolver(() => UserSchema)
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserSchema, { nullable: true })
  @UseMiddleware(isAuth)
  async userByID(@Arg('userId') userId: string): Promise<IUser | null> {
    try {
      const user: IUser = await this.userService.findUserById(userId);
      logger.info(`[resolver:User:userByID] Find user ${user.firstname} ${user.lastname}.`);
      return transformUser(user);
    } catch (error) {
      logger.error(`[resolver:User:userByID] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => [UserSchema])
  @UseMiddleware(isAuth)
  async users(): Promise<IUser[]> {
    try {
      const users = await this.userService.findUsers();
      logger.info(`[resolver:User:users] Find ${users.length} user${users.length > 0 ? 's' : ''}.`);
      return users.map(user => transformUser(user));
    } catch (error) {
      logger.error(`[resolver:User:users] ${error.message}.`);
      throw error;
    }
  }
}

export default UserResolver;
