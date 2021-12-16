import { capitalizeFirstLetter, containsOnlySpaces } from '@utils/string';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import CustomRegex from '@interfaces/custom-regex.interface';
import { isEmpty } from '@utils/object';
import { emailRegex, passwordRegex, phoneRegex } from './regex';

const validators = {
  isEmailValid: function (input: string) {
    return isValid(input, emailRegex);
  },
  isPasswordValid: function (input: string) {
    return isValid(input, passwordRegex);
  },
  isPhoneValid: function (input: string) {
    return isValid(input, phoneRegex);
  },
};

const isValid = (input: string, customRegex: CustomRegex): string | null => {
  if (!customRegex.regex.test(input)) return customRegex.errorMessage;
  return null;
};

const emptyArgsExist = (input: ChangePasswordInput | LoginInput | RegisterInput | { token: string } | { email: string }): Record<string, string> => {
  const emptyArgs = {};
  for (const [key, value] of Object.entries(input)) {
    if (isEmpty(value) || containsOnlySpaces(value)) {
      emptyArgs[key] = `${capitalizeFirstLetter(key)} cannot be empty`;
    }
  }
  return emptyArgs;
};

const invalidArgsExist = (
  input: Pick<ChangePasswordInput, 'password'> | LoginInput | Omit<RegisterInput, 'firstname' | 'lastname'>,
): Record<string, string> => {
  const invalidArgs = {};
  for (const [key, value] of Object.entries(input)) {
    const error = validators[`is${capitalizeFirstLetter(key)}Valid`](value);
    if (error) {
      invalidArgs[key] = error;
    }
  }
  return invalidArgs;
};

export { emptyArgsExist, invalidArgsExist, validators };
