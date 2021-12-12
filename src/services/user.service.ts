import User from '@schemas/user.schema';
import { IUser, IUserModel } from '@models/user.model';
import { isEmpty } from '@utils/object';
import { Inject, Service } from 'typedi';

@Service()
class UserService {
  constructor(@Inject('USER') private readonly users: IUserModel) {}

  async findUserById(userId: string): Promise<IUser | null> {
    if (isEmpty(userId)) throw new Error('Empty userId parameter');

    const user: IUser = await this.users.findOne({ _id: userId });
    if (!user) throw new Error('User not found');

    return user;
  }

  async findUsers(): Promise<User[]> {
    const users: any = await this.users.find();
    return users;
  }

  async revokeRefreshTokensByUserId(userId: string): Promise<boolean> {
    if (isEmpty(userId)) throw new Error('Empty userId parameter');

    const updatedUser = await this.users.findOneAndUpdate({ _id: userId }, { $inc: { tokenVersion: 1 } });
    if (!updatedUser) throw new Error('User not found');

    return true;
  }
}

export default UserService;
