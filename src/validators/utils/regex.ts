import CustomRegex from '@interfaces/custom-regex.interface';

const emailRegex: CustomRegex = {
  errorMessage: 'error.invalid_email',
  // Find a better one...
  regex: new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
};

const passwordRegex: CustomRegex = {
  errorMessage: 'error.invalid_password',
  regex: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/),
};

const phoneRegex: CustomRegex = {
  errorMessage: 'error.invalid_phone',
  regex: new RegExp(/^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/),
};

export { emailRegex, passwordRegex, phoneRegex };
