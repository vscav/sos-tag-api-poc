import { IAccount, IAccountModel } from '@models/account.model';
import { AccountResponse, AccountsResponse } from '@resolvers/account.resolver';
import { BooleanResponse } from '@responses';
import { transformAccount } from '@services/utils/transform';
import { isEmpty } from '@utils/object';
import { Inject, Service } from 'typedi';

@Service()
class AccountService {
  constructor(@Inject('ACCOUNT') private readonly accounts: IAccountModel) {}

  async findAccountById(accountId: string): Promise<AccountResponse> {
    if (isEmpty(accountId))
      return {
        errors: [
          {
            message: 'Empty accountId parameter.',
          },
        ],
      };

    const account: IAccount = await this.accounts.findOne({ _id: accountId });
    if (!account)
      return {
        errors: [
          {
            message: 'Account not found.',
          },
        ],
      };

    return { response: transformAccount(account) };
  }

  async findAccounts(): Promise<AccountsResponse> {
    const accounts: IAccount[] = await this.accounts.find();
    return { response: accounts.map(account => transformAccount(account)) };
  }

  async revokeRefreshTokensByAccountId(accountId: string): Promise<BooleanResponse> {
    if (isEmpty(accountId))
      return {
        errors: [
          {
            message: 'Empty accountId parameter.',
          },
        ],
      };

    const updatedAccount = await this.accounts.findOneAndUpdate({ _id: accountId }, { $inc: { tokenVersion: 1 } });
    if (!updatedAccount)
      return {
        errors: [
          {
            message: 'Account not found.',
          },
        ],
      };

    return { response: true };
  }
}

export default AccountService;
