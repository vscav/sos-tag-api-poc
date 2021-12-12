import { LoginInput, RegisterInput } from '@dtos/auth.dto';
import { emptyInputsExist, isEmailValid, isPasswordValid, isPhoneValid } from './utils/validate';

const checkLoginValidity = (loginInput: LoginInput) => {
  emptyInputsExist(loginInput);
  // const emptyInput = emptyInputsExist(loginInput);
  // if (!isEmpty(emptyInput)) return generateErrors(emptyInput);
};

const checkRegisterValidity = (registerInput: RegisterInput) => {
  emptyInputsExist(registerInput);

  const { email, phone, password } = registerInput;
  isEmailValid(email);
  isPhoneValid(phone);
  isPasswordValid(password);

  // const emptyInput = emptyInputsExist(registerInput);
  // if (!isEmpty(emptyInput)) return generateErrors(emptyInput);

  // const { email, phone, password } = registerInput;
  // const inputsToValidate = {
  //   email: isEmailValid(email),
  //   phone: isPhoneValid(phone),
  //   password: isPasswordValid(password),
  // };

  // const invalidInputs = filterObject(inputsToValidate, input => input !== null);

  // if (!isEmpty(invalidInputs)) {
  //   return generateErrors(invalidInputs);
  // }

  // return null;
};

// const generateErrors = (errorMessages: { [fieldName: string]: string }) => {
//   const errorsMap = {
//     errors: [],
//   };

//   for (const [field, message] of Object.entries(errorMessages)) {
//     errorsMap.errors.push({
//       field,
//       message,
//     });
//   }

//   return errorsMap;
// };

export { checkLoginValidity, checkRegisterValidity };
