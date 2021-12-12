import Context from '@interfaces/context.interface';
import { isAuth } from '@middlewares/is-auth.middleware';
import { IAccount } from '@models/account.model';
import AccountSchema from '@schemas/account.schema';
import AccountService from '@services/account.service';
import { logger } from '@utils/logger';
import 'dotenv/config';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { transformAccount } from './utils/transform';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

@Service()
@Resolver(() => AccountSchema)
class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => AccountSchema, { nullable: true })
  async currentAccount(@Ctx() { req }: Context): Promise<IAccount | null> {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, accessTokenSecret);
      const currentAccount = await this.accountById(payload.accountId);
      logger.info(`[resolver:Account:currentAccount] Current logged in account is ${currentAccount.firstname} ${currentAccount.lastname}.`);
      return currentAccount;
    } catch (error) {
      logger.error(`[resolver:Account:currentAccount] ${error.message}.`);
      return null;
    }
  }

  // IMPORTANT: Testing mutation only. We don't want to expose the possibility of revoking
  // token for a specific account. We would prefer to have a specific method (like "forgotPassword" for example)
  // which will use this kind of process. Maybe we also want to apply roles restriction to this mutation.
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async revokeRefreshTokensByAccountId(@Arg('accountId') accountId: string): Promise<boolean> {
    try {
      const success = await this.accountService.revokeRefreshTokensByAccountId(accountId);
      logger.info(`[resolver:User:revokeRefreshTokensForUser] Revoke refresh token.`);
      return success;
    } catch (error) {
      logger.error(`[resolver:User:revokeRefreshTokensForUser] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => AccountSchema, { nullable: true })
  @UseMiddleware(isAuth)
  async accountById(@Arg('accountId') accountId: string): Promise<IAccount | null> {
    try {
      const account: IAccount = await this.accountService.findAccountById(accountId);
      logger.info(`[resolver:Account:accountByID] Find account ${account.firstname} ${account.lastname}.`);
      return transformAccount(account);
    } catch (error) {
      logger.error(`[resolver:Account:accountByID] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => [AccountSchema])
  @UseMiddleware(isAuth)
  async accounts(): Promise<IAccount[]> {
    try {
      const accounts = await this.accountService.findAccounts();
      logger.info(`[resolver:Account:accounts] Find ${accounts.length} account${accounts.length > 0 ? 's' : ''}.`);
      return accounts.map(account => transformAccount(account));
    } catch (error) {
      logger.error(`[resolver:Account:accounts] ${error.message}.`);
      throw error;
    }
  }
}

export default AccountResolver;
