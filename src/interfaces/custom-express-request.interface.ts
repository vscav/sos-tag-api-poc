import { Request } from 'express';

interface CustomExpressRequest extends Request {
  isAuthenticated: Boolean;
  accountId: String;
}

export default CustomExpressRequest;
