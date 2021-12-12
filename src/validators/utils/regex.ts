import CustomRegex from '@interfaces/custom-regex.interface';

const emailRegex: CustomRegex = {
  errorMessage: 'Email must be a valid one',
  // Find a better one...
  regex: new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
};

const passwordRegex: CustomRegex = {
  errorMessage:
    'Password must contain a minimum of eight characters, and at least one uppercase letter, one lowercase letter and one number and one special character',
  regex: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/),
};

const phoneRegex: CustomRegex = {
  errorMessage: 'Phone must be a valid french phone number',
  regex: new RegExp(/^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/),
};

export { emailRegex, passwordRegex, phoneRegex };
