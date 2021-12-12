import { LoginInput, RegisterInput } from '@dtos/auth.dto';
import CustomRegex from '@interfaces/custom-regex.interface';
import { isEmpty } from '@utils/object';
import { emailRegex, phoneRegex } from './regex';

const emptyInputsExist = (input: LoginInput | RegisterInput) => {
  // const res = {};
  for (const [key, value] of Object.entries(input)) {
    if (isEmpty(value)) throw new Error(`${key} cannot be empty`);
    // if (isEmpty(value)) {
    //   res[key] = `${key} cannot be empty`;
    //   return res;
    // }
  }
};

const isEmailValid = (input: string) => {
  isValid(input, emailRegex);
};

const isPasswordValid = (input: string) => {
  // isValid(input, passwordRegex);
  return;
};

const isPhoneValid = (input: string) => {
  isValid(input, phoneRegex);
};

const isValid = (input: string, customRegex: CustomRegex) => {
  if (!customRegex.regex.test(input)) throw new Error(customRegex.errorMessage);
  // return null;
};

export { emptyInputsExist, isEmailValid, isPasswordValid, isPhoneValid };
