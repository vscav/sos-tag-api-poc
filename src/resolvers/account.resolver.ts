import Context from '@interfaces/context.interface';
import { isAuth } from '@middlewares/is-auth.middleware';
import { ObjectsResponse, SingleObjectResponse } from '@responses';
import AccountSchema from '@schemas/account.schema';
import AccountService from '@services/account.service';
import { logger } from '@utils/logger';
import 'dotenv/config';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

@ObjectType({ description: 'Account response' })
class AccountResponse extends SingleObjectResponse(AccountSchema) {}

@ObjectType({ description: 'Accounts response' })
class AccountsResponse extends ObjectsResponse(AccountSchema) {}

@Service()
@Resolver(() => AccountSchema)
class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => AccountResponse)
  async currentAccount(@Ctx() { req }: Context): Promise<AccountResponse> {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, accessTokenSecret);
      const currentAccount = await this.accountById(payload.accountId);
      return currentAccount;
    } catch (error) {
      logger.error(`[resolver:Account:currentAccount] ${error.message}.`);
      return null;
    }
  }

  @Query(() => AccountResponse)
  @UseMiddleware(isAuth)
  async accountById(@Arg('accountId') accountId: string): Promise<AccountResponse> {
    try {
      const account = await this.accountService.findAccountById(accountId);
      return account;
    } catch (error) {
      logger.error(`[resolver:Account:accountByID] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => AccountsResponse)
  @UseMiddleware(isAuth)
  async accounts(): Promise<AccountsResponse> {
    try {
      const accounts = await this.accountService.findAccounts();
      return accounts;
    } catch (error) {
      logger.error(`[resolver:Account:accounts] ${error.message}.`);
      throw error;
    }
  }
}

export { AccountResponse, AccountsResponse };
export default AccountResolver;
