import { confirmAccountPrefix, forgotPasswordPrefix } from '@constants/redis-prefixes';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import { IAccount, IAccountModel } from '@models/account.model';
import { LoginResponse } from '@resolvers/auth.resolver';
import { transformAccount } from '@resolvers/utils/transform';
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

  async changePassword({ token, password }: ChangePasswordInput): Promise<IAccount | null> {
    const accountId = await redis.get(forgotPasswordPrefix + token);
    if (!accountId) throw new Error('Password modification process has expired. Resend a new email to change this account password.');

    const account: IAccount = await this.accounts.findOne({ _id: accountId });
    if (!account) throw new Error('Account not found');

    await redis.del(forgotPasswordPrefix + token);

    account.password = await hash(password, 12);

    return await account.save();
  }

  async confirmAccount(token: string): Promise<boolean> {
    const accountId = await redis.get(confirmAccountPrefix + token);
    if (!accountId) throw new Error('Confirmation process has expired. Resend a new confirmation email.');

    await this.accounts.findOneAndUpdate({ _id: accountId }, { confirmed: true });

    await redis.del(confirmAccountPrefix + token);

    return true;
  }

  async forgotPassword(accountEmail: string): Promise<boolean> {
    const account: IAccount = await this.accounts.findOne({ email: accountEmail });
    if (!account) throw new Error('Account not found');

    await sendEmail(accountEmail, 'Change your account password', await createForgotPasswordUrl(account.id));

    return true;
  }

  async login({ email, password }: LoginInput, res: Response): Promise<LoginResponse> {
    checkLoginValidity({ email, password });

    const account = await this.accounts.findOne({ email });
    if (!account) throw new Error('Account does not exist.');

    const valid = await compare(password, account.password);
    if (!valid) throw new Error('Password is incorrect.');

    if (!account.confirmed) throw new Error('Account must be validated.');

    const accessToken = createAccessToken(account);
    const refreshToken = createRefreshToken(account);

    sendRefreshToken(res, refreshToken);

    return {
      account: transformAccount(account),
      accessToken: accessToken,
    };
  }

  async logout(res: Response): Promise<boolean> {
    sendRefreshToken(res, '');
    return true;
  }

  async register({ firstname, lastname, email, phone, password }: RegisterInput): Promise<IAccount | null> {
    checkRegisterValidity({ firstname, lastname, email, phone, password });

    const accountFound = await this.accounts.findOne({ email });
    if (accountFound) throw new Error('Account already exists.');

    const hashedPassword = await hash(password, 12);

    const account = await this.accounts.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    });

    await sendEmail(email, 'Confirm your account', await createConfirmationUrl(account.id));

    return await account.save();
  }
}

export default AuthService;