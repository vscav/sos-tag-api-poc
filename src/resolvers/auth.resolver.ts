import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import Context from '@interfaces/context.interface';
import { IAccount } from '@models/account.model';
import AccountSchema from '@schemas/account.schema';
import AuthService from '@services/auth.service';
import { logger } from '@utils/logger';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { BooleanResponse, SingleObjectResponse } from '@responses';
import { AccountResponse } from './account.resolver';

@ObjectType()
class LoginResponseData {
  @Field(() => AccountSchema)
  account: IAccount;
  @Field(() => String)
  accessToken: string;
}

@ObjectType({ description: 'Login response' })
class LoginResponse extends SingleObjectResponse(LoginResponseData) {}

@Service()
@Resolver(() => AccountSchema)
class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccountSchema)
  async changePassword(@Arg('changePasswordInput') changePasswordInput: ChangePasswordInput): Promise<AccountResponse> {
    try {
      const changePasswordResponse = await this.authService.changePassword(changePasswordInput);
      return changePasswordResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:changePassword] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => BooleanResponse)
  async confirmAccount(@Arg('token') token: string): Promise<BooleanResponse> {
    try {
      const confirmationResponse = await this.authService.confirmAccount(token);
      return confirmationResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:confirmAccount] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => BooleanResponse)
  async forgotPassword(@Arg('accountEmail') accountEmail: string): Promise<BooleanResponse> {
    try {
      const forgotPasswordResponse = await this.authService.forgotPassword(accountEmail);
      return forgotPasswordResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:forgotPassword] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg('loginInput') loginInput: LoginInput, @Ctx() { res }: Context): Promise<LoginResponse> {
    try {
      const loginResponse: LoginResponse = await this.authService.login(loginInput, res);
      return loginResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:login] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => BooleanResponse)
  async logout(@Ctx() { res }: Context): Promise<BooleanResponse> {
    try {
      const logoutResponse = await this.authService.logout(res);
      return logoutResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:logout] ${error.message}.`);
      throw error;
    }
  }

  @Mutation(() => AccountResponse)
  async register(@Arg('registerInput') registerInput: RegisterInput): Promise<AccountResponse> {
    try {
      const registerResponse = await this.authService.register(registerInput);
      return registerResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:register] ${error.message}`);
      throw error;
    }
  }
}

export { LoginResponse, LoginResponseData };
export default AuthResolver;
