import { ContextPayload } from '@interfaces/context.interface';
import tokenConfig from '@interfaces/token.interface';
import accountModel, { IUser } from '@models/user.model';
import config from 'config';
import 'dotenv/config';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

const { duration: accessTokenDuration }: tokenConfig = config.get('accessToken');
const { duration: refreshTokenDuration }: tokenConfig = config.get('refreshToken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const createAccessToken = (account: IUser) => {
  return sign(
    {
      accountId: account.id,
    },
    accessTokenSecret,
    {
      expiresIn: `${accessTokenDuration}m`, // What access token duration do we want? Do we want differences between dev, prod and test mode?
    },
  );
};

const createRefreshToken = (account: IUser) => {
  return sign(
    {
      userId: account.id,
      tokenVersion: account.tokenVersion,
    },
    refreshTokenSecret,
    {
      expiresIn: `${refreshTokenDuration}d`, // What refresh token duration do we want? Do we want differences between dev, prod and test mode?
    },
  );
};

const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: ContextPayload = null;
  try {
    payload = verify(token, refreshTokenSecret);
  } catch (err) {
    return res.send({ ok: false, accessToken: '' });
  }

  // Refresh token is valid and we can send back an access token
  const account: IUser = await accountModel.findOne({ _id: payload.userId });

  if (!account) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (account.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(account));
  return res.send({ ok: true, accessToken: createAccessToken(account) });
};

const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
};

export { createAccessToken, createRefreshToken, refreshToken, sendRefreshToken };
