import { capitalizeFirstLetter, containsOnlySpaces } from '@utils/string';
import { ChangePasswordInput, LoginInput, RegisterInput } from '@dtos/auth.dto';
import CustomRegex from '@interfaces/custom-regex.interface';
import { isEmpty } from '@utils/object';
import { emailRegex, passwordRegex, phoneRegex } from './regex';
import { Request } from 'express';

const validators = {
  isEmailValid: function (input: string, req: Request) {
    return isValid(input, emailRegex, req);
  },
  isPasswordValid: function (input: string, req: Request) {
    return isValid(input, passwordRegex, req);
  },
  isPhoneValid: function (input: string, req: Request) {
    return isValid(input, phoneRegex, req);
  },
};

const isValid = (input: string, customRegex: CustomRegex, req: Request): string | null => {
  if (!customRegex.regex.test(input)) return req.t(customRegex.errorMessage);
  return null;
};

const emptyArgsExist = (
  input: ChangePasswordInput | LoginInput | RegisterInput | { token: string } | { email: string },
  req: Request,
): Record<string, string> => {
  const emptyArgs = {};
  for (const [key, value] of Object.entries(input)) {
    if (isEmpty(value) || containsOnlySpaces(value)) {
      emptyArgs[key] = req.t('error.empty_input', { what: capitalizeFirstLetter(req.t(`input.${key}_with_article`)) });
    }
  }
  return emptyArgs;
};

const invalidArgsExist = (
  input: Pick<ChangePasswordInput, 'password'> | LoginInput | Omit<RegisterInput, 'firstname' | 'lastname'>,
  req: Request,
): Record<string, string> => {
  const invalidArgs = {};
  for (const [key, value] of Object.entries(input)) {
    const validator = `is${capitalizeFirstLetter(key)}Valid`;

    if (!Object.keys(validators).includes(validator))
      throw new Error(`${capitalizeFirstLetter(key)} has no corresponding validator method (${validator} function not found)`);
    const error = validators[validator](value, req);

    if (error) {
      invalidArgs[key] = error;
    }
  }
  return invalidArgs;
};

export { emptyArgsExist, invalidArgsExist, validators };
