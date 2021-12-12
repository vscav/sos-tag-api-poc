import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import Context from '@interfaces/context.interface';
import { IAccount } from '@models/account.model';
import AccountSchema from '@schemas/account.schema';
import AuthService from '@services/auth.service';
import { logger } from '@utils/logger';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { transformAccount } from './utils/transform';

@ObjectType({ description: 'Login response' })
class LoginResponse {
  @Field(() => AccountSchema)
  account: IAccount;
  @Field(() => String)
  accessToken: string;
}

@Service()
@Resolver(() => AccountSchema)
class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccountSchema)
  async changePassword(@Arg('changePasswordInput') changePasswordInput: ChangePasswordInput): Promise<IAccount | null> {
    try {
      const account = await this.authService.changePassword(changePasswordInput);
      logger.info(`[resolver:Auth:changePassword] Account was confirmed.`);
      return transformAccount(account);
    } catch (error) {
      logger.error(`[resolver:Auth:changePassword] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async confirmAccount(@Arg('token') token: string): Promise<boolean> {
    try {
      const confirmationResponse = await this.authService.confirmAccount(token);
      logger.info(`[resolver:Auth:confirmAccount] Account was confirmed.`);
      return confirmationResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:confirmAccount] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('accountEmail') accountEmail: string): Promise<boolean> {
    try {
      const forgotPasswordResponse = await this.authService.forgotPassword(accountEmail);
      logger.info(`[resolver:Auth:forgotPassword] Email has been sent.`);
      return forgotPasswordResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:forgotPassword] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login(@Arg('loginInput') loginInput: LoginInput, @Ctx() { res }: Context): Promise<LoginResponse | null> {
    try {
      const loginResponse: LoginResponse = await this.authService.login(loginInput, res);
      logger.info(`[resolver:Auth:login] User logged in successfully.`);
      return loginResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:login] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    try {
      const logoutResponse = await this.authService.logout(res);
      logger.info(`[resolver:Auth:logout] User logged out successfully.`);
      return logoutResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:logout] ${error.message}.`);
      throw error;
    }
  }

  @Mutation(() => AccountSchema, { nullable: true })
  async register(@Arg('registerInput') registerInput: RegisterInput): Promise<IAccount | null> {
    try {
      const account = await this.authService.register(registerInput);
      logger.info(
        `[resolver:Auth:register] Registered ${account.firstname} ${account.lastname} account successfully. Confirmation email has been sent.`,
      );
      return transformAccount(account);
    } catch (error) {
      logger.error(`[resolver:Auth:register] ${error.message}`);
      throw error;
    }
  }
}

export { LoginResponse };
export default AuthResolver;
