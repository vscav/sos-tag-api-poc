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
  // @Length(1, 35)
  firstname: string;
  @Field()
  // @Length(1, 35)
  lastname: string;
  @Field()
  // @IsEmail()
  email: string;
  @Field()
  phone: string;
  @Field()
  // @MinLength(4)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
  password: string;
}

export { ChangePasswordInput, LoginInput, RegisterInput };
