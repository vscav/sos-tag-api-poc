import { UserResponse, UsersResponse } from '@responses/user.response';
import Context from '@interfaces/context.interface';
import { isAuth } from '@middlewares/is-auth.middleware';
import UserSchema from '@schemas/user.schema';
import UserService from '@services/user.service';
import { logger } from '@utils/logger';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

@Service()
@Resolver(() => UserSchema)
class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse, { description: 'Get the user currently logged in.' })
  async currentUser(@Ctx() { req }: Context): Promise<UserResponse> {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, accessTokenSecret);
      const currentUser = await this.userById(payload.userId);
      return currentUser;
    } catch (error) {
      logger.error(`[resolver:User:currentUser] ${error.message}.`);
      return null;
    }
  }

  @Query(() => UserResponse, { description: 'Get a user by his id.' })
  @UseMiddleware(isAuth)
  async userById(@Arg('userId') userId: string): Promise<UserResponse> {
    try {
      const user = await this.userService.findUserById(userId);
      return user;
    } catch (error) {
      logger.error(`[resolver:User:userByID] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => UsersResponse, { description: 'Get all users.' })
  @UseMiddleware(isAuth)
  async users(): Promise<UsersResponse> {
    try {
      const users = await this.userService.findUsers();
      return users;
    } catch (error) {
      logger.error(`[resolver:User:users] ${error.message}.`);
      throw error;
    }
  }
}

export default UserResolver;
