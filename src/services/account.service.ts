import { IAccount, IAccountModel } from '@models/account.model';
import { isEmpty } from '@utils/object';
import { Inject, Service } from 'typedi';

@Service()
class AccountService {
  constructor(@Inject('ACCOUNT') private readonly accounts: IAccountModel) {}

  async findAccountById(accountId: string): Promise<IAccount | null> {
    if (isEmpty(accountId)) throw new Error('Empty accountId parameter');

    const account: IAccount = await this.accounts.findOne({ _id: accountId });
    if (!account) throw new Error('Account not found');

    return account;
  }

  async findAccounts(): Promise<IAccount[]> {
    const accounts: IAccount[] = await this.accounts.find();
    return accounts;
  }

  async revokeRefreshTokensByAccountId(accountId: string): Promise<boolean> {
    if (isEmpty(accountId)) throw new Error('Empty accountId parameter');

    const updatedAccount = await this.accounts.findOneAndUpdate({ _id: accountId }, { $inc: { tokenVersion: 1 } });
    if (!updatedAccount) throw new Error('Account not found');

    return true;
  }
}

export default AccountService;
