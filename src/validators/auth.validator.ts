import { LoginInput, RegisterInput } from '@dtos/auth.dto';
import { filterObject, isEmpty } from '@utils/object';
import { emptyArgsExist, isEmailValid, isPasswordValid, isPhoneValid } from './utils/validate';

const checkLoginValidity = (loginInput: LoginInput) => {
  const emptyArgs = emptyArgsExist(loginInput);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);
};

const checkRegisterValidity = (registerInput: RegisterInput) => {
  const emptyArgs = emptyArgsExist(registerInput);
  if (!isEmpty(emptyArgs)) return generateFieldErrors(emptyArgs);

  const { email, phone, password } = registerInput;
  const argsToValidate = {
    email: isEmailValid(email),
    phone: isPhoneValid(phone),
    password: isPasswordValid(password),
  };

  const invalidArgs = filterObject(argsToValidate, (input: string) => input !== null);

  if (!isEmpty(invalidArgs)) return generateFieldErrors(invalidArgs);

  return;
};

const generateFieldErrors = (errorMessages: { [fieldName: string]: string }) => {
  const errorsMap = {
    errors: [],
  };

  for (const [field, message] of Object.entries(errorMessages)) {
    errorsMap.errors.push({
      field,
      message,
    });
  }

  return errorsMap;
};

export { checkLoginValidity, checkRegisterValidity };
