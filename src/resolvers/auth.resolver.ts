import { UserResponse } from '@responses/user.response';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import Context from '@interfaces/context.interface';
import { LoginResponse } from '@responses/auth.response';
import { BooleanResponse } from '@responses/common.response';
import UserSchema from '@schemas/user.schema';
import AuthService from '@services/auth.service';
import { logger } from '@utils/logger';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

@Service()
@Resolver(() => UserSchema)
class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { description: 'Return a simple welcoming message.' })
  async welcome(@Ctx() { req }: Context): Promise<string> {
    try {
      return req.t('greetings.welcome', { what: 'SOS-Tag API (alpha version)' });
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UserResponse, {
    description:
      'Change the password of a specific user. It implies that the user has already made a modification request, as a token has to be generated to retrieve the user id.',
  })
  async changePassword(@Arg('changePasswordInput') changePasswordInput: ChangePasswordInput, @Ctx() { req }: Context): Promise<UserResponse> {
    try {
      const changePasswordResponse = await this.authService.changePassword(changePasswordInput, req);
      return changePasswordResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:changePassword] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => BooleanResponse, {
    description: 'Confirm and validate a user. Validation is based on the existence of the email address used during the registration process.',
  })
  async confirmUser(@Arg('token') token: string, @Ctx() { req }: Context): Promise<BooleanResponse> {
    try {
      const confirmationResponse = await this.authService.confirmUser(token, req);
      return confirmationResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:confirmUser] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => BooleanResponse, {
    description:
      'Send an email containing a link that redirect to change password dedicated route on the frontend. The link contains a token that, once decoded, will reveal the user id.',
  })
  async forgotPassword(@Arg('userEmail') userEmail: string, @Ctx() { req }: Context): Promise<BooleanResponse> {
    try {
      const forgotPasswordResponse = await this.authService.forgotPassword(userEmail, req);
      return forgotPasswordResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:forgotPassword] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => LoginResponse, { description: 'Log the user in using his email address and his password.' })
  async login(@Arg('loginInput') loginInput: LoginInput, @Ctx() { req, res }: Context): Promise<LoginResponse> {
    try {
      const loginResponse: LoginResponse = await this.authService.login(loginInput, req, res);
      return loginResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:login] ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => BooleanResponse, { description: 'Log the user out. He will no longer be authenticated.' })
  async logout(@Ctx() { res }: Context): Promise<BooleanResponse> {
    try {
      const logoutResponse = await this.authService.logout(res);
      return logoutResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:logout] ${error.message}.`);
      throw error;
    }
  }

  @Mutation(() => UserResponse, {
    description:
      'Register a new user. To complete the registration, the user will have to confirm his account by following the link that has been sent to him by email.',
  })
  async register(@Arg('registerInput') registerInput: RegisterInput, @Ctx() { req }: Context): Promise<UserResponse> {
    try {
      const registerResponse = await this.authService.register(registerInput, req);
      return registerResponse;
    } catch (error) {
      logger.error(`[resolver:Auth:register] ${error.message}`);
      throw error;
    }
  }
}

export default AuthResolver;
