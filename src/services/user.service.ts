import { IUser, IUserModel } from '@models/user.model';
import { BooleanResponse } from '@responses/common.response';
import { UserResponse, UsersResponse } from '@responses/user.response';
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

    const account: IUser = await this.users.findOne({ _id: userId });
    if (!account)
      return {
        errors: [
          {
            message: 'User not found.',
          },
        ],
      };

    return { response: transformUser(account) };
  }

  async findUsers(): Promise<UsersResponse> {
    const accounts: IUser[] = await this.users.find();
    return { response: accounts.map(account => transformUser(account)) };
  }

  async revokeRefreshTokensByUserId(userId: string): Promise<BooleanResponse> {
    if (isEmpty(userId))
      return {
        errors: [
          {
            message: 'Empty userId parameter.',
          },
        ],
      };

    const updatedUser = await this.users.findOneAndUpdate({ _id: userId }, { $inc: { tokenVersion: 1 } });
    if (!updatedUser)
      return {
        errors: [
          {
            message: 'User not found.',
          },
        ],
      };

    return { response: true };
  }
}

export default UserService;
