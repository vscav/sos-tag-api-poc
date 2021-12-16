import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import { isEmpty } from '@utils/object';
import { generateFieldErrors } from './utils/errors';
import { emptyArgsExist, invalidArgsExist } from './utils/validate';

const checkChangePasswordValidity = (changePasswordInput: ChangePasswordInput) => {
  const emptyArgs = emptyArgsExist(changePasswordInput);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);

  const { password } = changePasswordInput;

  const invalidArgs = invalidArgsExist({ password });
  if (!isEmpty(invalidArgs)) return generateFieldErrors(invalidArgs);
};

const checkConfirmAccountValidity = (token: string) => {
  const emptyArgs = emptyArgsExist({ token });
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkForgotPasswordValidity = (email: string) => {
  const emptyArgs = emptyArgsExist({ email });
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkLoginValidity = (loginInput: LoginInput) => {
  const emptyArgs = emptyArgsExist(loginInput);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkRegisterValidity = (registerInput: RegisterInput) => {
  const emptyArgs = emptyArgsExist(registerInput);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);

  const { email, phone, password } = registerInput;

  const invalidArgs = invalidArgsExist({ email, phone, password });
  if (!isEmpty(invalidArgs)) return generateFieldErrors(invalidArgs);
};

export { checkChangePasswordValidity, checkConfirmAccountValidity, checkForgotPasswordValidity, checkLoginValidity, checkRegisterValidity };
