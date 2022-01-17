import { dateToString } from '@utils/date';

const transformQRCode = qrCode => {
  return {
    ...qrCode._doc,
    _id: qrCode.id,
    createdAt: dateToString(qrCode.createdAt),
    updatedAt: dateToString(qrCode.updatedAt),
  };
};

const transformUser = account => {
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

export { transformQRCode, transformUser };
