import { LoginInput, RegisterInput } from '@dtos/auth.dto';
import CustomRegex from '@interfaces/custom-regex.interface';
import { isEmpty } from '@utils/object';
import { emailRegex, passwordRegex, phoneRegex } from './regex';

const emptyArgsExist = (input: LoginInput | RegisterInput): Record<string, string> => {
  const res = {};
  for (const [key, value] of Object.entries(input)) {
    if (isEmpty(value)) {
      res[key] = `${key} cannot be empty`;
    }
  }
  return res;
};

const isEmailValid = (input: string) => {
  return isValid(input, emailRegex);
};

const isPasswordValid = (input: string) => {
  return isValid(input, passwordRegex);
};

const isPhoneValid = (input: string) => {
  return isValid(input, phoneRegex);
};

const isValid = (input: string, customRegex: CustomRegex): string | null => {
  if (!customRegex.regex.test(input)) return customRegex.errorMessage;
  return null;
};

export { emptyArgsExist, isEmailValid, isPasswordValid, isPhoneValid };
