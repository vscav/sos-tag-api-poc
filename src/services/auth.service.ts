import { confirmAccountPrefix, forgotPasswordPrefix } from '@constants/redis-prefixes';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import { IAccount, IAccountModel } from '@models/account.model';
import { AccountResponse } from '@resolvers/account.resolver';
import { LoginResponse } from '@resolvers/auth.resolver';
import { BooleanResponse } from '@responses';
import { transformAccount } from '@services/utils/transform';
import { createConfirmationUrl, createForgotPasswordUrl, sendEmail } from '@utils/email';
import { formatObject } from '@utils/format';
import { createAccessToken, createRefreshToken, sendRefreshToken } from '@utils/token';
import {
  checkChangePasswordValidity,
  checkConfirmAccountValidity,
  checkForgotPasswordValidity,
  checkLoginValidity,
  checkRegisterValidity,
} from '@validators/auth.validator';
import { compare, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import { redis } from '../redis';

@Service()
class AuthService {
  constructor(@Inject('ACCOUNT') private readonly accounts: IAccountModel) {}

  async changePassword({ token, password }: ChangePasswordInput, req: Request): Promise<AccountResponse> {
    const errors = checkChangePasswordValidity({ token, password }, req);
    if (errors) return errors;

    const accountId = await redis.get(forgotPasswordPrefix + token);
    if (!accountId)
      return {
        errors: [
          {
            message: req.t('auth.password_modification_expired'),
          },
        ],
      };

    const account: IAccount = await this.accounts.findOne({ _id: accountId });
    if (!account)
      return {
        errors: [
          {
            message: req.t('auth.account_does_not_exist'),
          },
        ],
      };

    await redis.del(forgotPasswordPrefix + token);

    account.password = await hash(password, 12);

    return { response: transformAccount(await account.save()) };
  }

  async confirmAccount(token: string, req: Request): Promise<BooleanResponse> {
    const errors = checkConfirmAccountValidity(token, req);
    if (errors) return errors;

    const accountId = await redis.get(confirmAccountPrefix + token);
    if (!accountId)
      return {
        errors: [
          {
            message: req.t('auth.accont_confirmation_expired'),
          },
        ],
      };

    await this.accounts.findOneAndUpdate({ _id: accountId }, { confirmed: true });

    await redis.del(confirmAccountPrefix + token);

    return { response: true };
  }

  async forgotPassword(accountEmail: string, req: Request): Promise<BooleanResponse> {
    const errors = checkForgotPasswordValidity(accountEmail, req);
    if (errors) return errors;

    const account: IAccount = await this.accounts.findOne({ email: accountEmail });
    if (!account)
      return {
        errors: [
          {
            message: req.t('auth.account_does_not_exist'),
          },
        ],
      };

    await sendEmail('change_password', account.firstname, accountEmail, await createForgotPasswordUrl(account.id), req);

    return { response: true };
  }

  async login(loginInput: LoginInput, req: Request, res: Response): Promise<LoginResponse> {
    const errors = checkLoginValidity(loginInput, req);
    if (errors) return errors;

    const formattedLoginInput = formatObject(loginInput) as LoginInput;
    const { email, password } = formattedLoginInput;

    const account = await this.accounts.findOne({ email });
    if (!account)
      return {
        errors: [
          {
            message: req.t('auth.account_does_not_exist'),
          },
        ],
      };

    const valid = await compare(password, account.password);
    if (!valid)
      return {
        errors: [
          {
            message: req.t('auth.incorrect_password'),
          },
        ],
      };

    if (!account.confirmed)
      return {
        errors: [
          {
            message: req.t('auth.unvalidated_account', { email }),
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

  async register(registerInput: RegisterInput, req: Request): Promise<AccountResponse> {
    const errors = checkRegisterValidity(registerInput, req);
    if (errors) return errors;

    const formattedRegisterInput = formatObject(registerInput) as RegisterInput;
    const { firstname, lastname, email, phone, password } = formattedRegisterInput;

    const accountFound = await this.accounts.findOne({ email });
    if (accountFound)
      return {
        errors: [
          {
            message: req.t('auth.account_already_exist', { email }),
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

    await sendEmail('confirm_account', firstname, email, await createConfirmationUrl(account.id), req);

    return { response: transformAccount(await account.save()) };
  }
}

export default AuthService;
