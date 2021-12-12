import { confirmAccountPrefix, forgotPasswordPrefix } from '@constants/redis-prefixes';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import { IAccount, IAccountModel } from '@models/account.model';
import { AccountResponse } from '@resolvers/account.resolver';
import { LoginResponse } from '@resolvers/auth.resolver';
import { BooleanResponse } from '@responses';
import { transformAccount } from '@services/utils/transform';
import { createConfirmationUrl, createForgotPasswordUrl, sendEmail } from '@utils/email';
import { createAccessToken, createRefreshToken, sendRefreshToken } from '@utils/token';
import { checkLoginValidity, checkRegisterValidity } from '@validators/auth.validator';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { Inject, Service } from 'typedi';
import { redis } from '../redis';

@Service()
class AuthService {
  constructor(@Inject('ACCOUNT') private readonly accounts: IAccountModel) {}

  async changePassword({ token, password }: ChangePasswordInput): Promise<AccountResponse> {
    const accountId = await redis.get(forgotPasswordPrefix + token);
    if (!accountId)
      return {
        errors: [
          {
            message: 'Password modification process has expired. Resend a new email to change this account password.',
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

    await redis.del(forgotPasswordPrefix + token);

    account.password = await hash(password, 12);

    return { response: transformAccount(await account.save()) };
  }

  async confirmAccount(token: string): Promise<BooleanResponse> {
    const accountId = await redis.get(confirmAccountPrefix + token);
    if (!accountId)
      return {
        errors: [
          {
            message: 'Confirmation process has expired. Resend a new confirmation email.',
          },
        ],
      };

    await this.accounts.findOneAndUpdate({ _id: accountId }, { confirmed: true });

    await redis.del(confirmAccountPrefix + token);

    return { response: true };
  }

  async forgotPassword(accountEmail: string): Promise<BooleanResponse> {
    const account: IAccount = await this.accounts.findOne({ email: accountEmail });
    if (!account)
      return {
        errors: [
          {
            message: 'Account not found.',
          },
        ],
      };

    await sendEmail(accountEmail, 'Change your account password', await createForgotPasswordUrl(account.id));

    return { response: true };
  }

  async login({ email, password }: LoginInput, res: Response): Promise<LoginResponse> {
    checkLoginValidity({ email, password });

    const account = await this.accounts.findOne({ email });
    if (!account)
      return {
        errors: [
          {
            message: 'Account does not exist.',
          },
        ],
      };

    const valid = await compare(password, account.password);
    if (!valid)
      return {
        errors: [
          {
            message: 'Password is incorrect.',
          },
        ],
      };

    if (!account.confirmed)
      return {
        errors: [
          {
            message: 'Account must be validated.',
          },
        ],
      };

    const accessToken = createAccessToken(account);
    const refreshToken = createRefreshToken(account);

    sendRefreshToken(res, refreshToken);

    return {
      response: {
        account: transformAccount(account),
        accessToken: accessToken,
      },
    };
  }

  async logout(res: Response): Promise<BooleanResponse> {
    sendRefreshToken(res, '');
    return { response: true };
  }

  async register({ firstname, lastname, email, phone, password }: RegisterInput): Promise<AccountResponse> {
    const errors = checkRegisterValidity({ firstname, lastname, email, phone, password });
    if (errors) return errors;

    const accountFound = await this.accounts.findOne({ email });
    if (accountFound)
      return {
        errors: [
          {
            message: 'Account already exists.',
          },
        ],
      };

    const hashedPassword = await hash(password, 12);

    const account = await this.accounts.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    });

    await sendEmail(email, 'Confirm your account', await createConfirmationUrl(account.id));

    return { response: transformAccount(await account.save()) };
  }
}

export default AuthService;
