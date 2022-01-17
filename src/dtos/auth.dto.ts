import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType({ description: 'Change password input' })
class ChangePasswordInput {
  @Field()
  token: string;
  @Field()
  password: string;
}

@InputType({ description: 'Login input' })
class LoginInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  password: string;
}

@InputType({ description: 'Register input' })
class RegisterInput {
  @Field()
  firstname: string;
  @Field()
  lastname: string;
  @Field()
  email: string;
  @Field()
  phone: string;
  @Field()
  password: string;
}

export { ChangePasswordInput, LoginInput, RegisterInput };
