import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import { isEmpty } from '@utils/object';
import { Request } from 'express';
import { generateFieldErrors } from './utils/errors';
import { emptyArgsExist, invalidArgsExist } from './utils/validate';

const checkChangePasswordValidity = (changePasswordInput: ChangePasswordInput, req: Request) => {
  const emptyArgs = emptyArgsExist(changePasswordInput, req);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);

  const { password } = changePasswordInput;

  const invalidArgs = invalidArgsExist({ password }, req);
  if (!isEmpty(invalidArgs)) return generateFieldErrors(invalidArgs);
};

const checkConfirmAccountValidity = (token: string, req: Request) => {
  const emptyArgs = emptyArgsExist({ token }, req);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkForgotPasswordValidity = (email: string, req: Request) => {
  const emptyArgs = emptyArgsExist({ email }, req);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkLoginValidity = (loginInput: LoginInput, req: Request) => {
  const emptyArgs = emptyArgsExist(loginInput, req);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkRegisterValidity = (registerInput: RegisterInput, req: Request) => {
  const emptyArgs = emptyArgsExist(registerInput, req);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);

  const { email, phone, password } = registerInput;

  const invalidArgs = invalidArgsExist({ email, phone, password }, req);
  if (!isEmpty(invalidArgs)) return generateFieldErrors(invalidArgs);
};

export { checkChangePasswordValidity, checkConfirmAccountValidity, checkForgotPasswordValidity, checkLoginValidity, checkRegisterValidity };
