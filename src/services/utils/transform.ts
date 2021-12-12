import { dateToString } from '@utils/date';

const transformAccount = account => {
  return {
    ...account._doc,
    _id: account.id,
    // We want to overwrite the password with a null value to avoid
    // returning it (even if it is a hash, it can cause security issues)
    password: null,
    createdAt: dateToString(account.createdAt),
    updatedAt: dateToString(account.updatedAt),
  };
};

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    createdAt: dateToString(user.createdAt),
    updatedAt: dateToString(user.updatedAt),
  };
};

export { transformAccount, transformUser };
