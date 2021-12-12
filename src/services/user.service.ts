import { IUser, IUserModel } from '@models/user.model';
import { UserResponse } from '@resolvers/user.resolver';
import { transformUser } from '@services/utils/transform';
import { isEmpty } from '@utils/object';
import { Inject, Service } from 'typedi';

@Service()
class UserService {
  constructor(@Inject('USER') private readonly users: IUserModel) {}

  async findUserById(userId: string): Promise<UserResponse> {
    if (isEmpty(userId))
      return {
        errors: [
          {
            message: 'Empty userId parameter.',
          },
        ],
      };

    const user: IUser = await this.users.findOne({ _id: userId });
    if (!user)
      return {
        errors: [
          {
            message: 'User not found.',
          },
        ],
      };

    return { response: transformUser(user) };
  }

  async findUsers(): Promise<UserResponse> {
    const users: IUser[] = await this.users.find();
    return { response: users.map((user: IUser) => transformUser(user)) };
  }
}

export default UserService;
