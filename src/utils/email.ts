import { confirmUserPrefix, forgotPasswordPrefix } from '@constants/redis-prefixes';
import { Request } from 'express';
import fs from 'fs';
import { google } from 'googleapis';
import hogan from 'hogan.js';
import inlineCss from 'inline-css';
import { nanoid } from 'nanoid';
import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import path from 'path';
import { redis } from '../redis';

type EmailAim = 'change_password' | 'confirm_user';

const OAuth2 = google.auth.OAuth2;
const OAuth2Client = new OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET);

OAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_CLIENT_REFRESH_TOKEN });

const createConfirmationUrl = async (accountId: string) => {
  const token = nanoid();
  await redis.set(confirmUserPrefix + token, accountId, 'ex', 60 * 60 * 24);

  // Must correspond to the dedicated route on the frontend
  return `http://localhost:3000/user/confirm/${token}`;
};

const createForgotPasswordUrl = async (accountId: string) => {
  const token = nanoid();
  await redis.set(forgotPasswordPrefix + token, accountId, 'ex', 60 * 60 * 24);

  // Must correspond to the dedicated route on the frontend
  return `http://localhost:3000/user/change-password/${token}`;
};

const sendEmail = async (type: EmailAim, name: string, email: string, url: string, req: Request): Promise<void> => {
  const accessToken = OAuth2Client.getAccessToken();

  const auth: SMTPConnection.AuthenticationTypeOAuth2 = {
    type: 'OAuth2',
    user: process.env.GOOGLE_OAUTH_CLIENT_USER,
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_OAUTH_CLIENT_REFRESH_TOKEN,
    accessToken: accessToken as unknown as string,
  };

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth,
  });

  const templateFile = fs.readFileSync(path.resolve(__dirname, '../templates/basic-email.html'));
  const styledTemplate = await inlineCss(templateFile.toString(), { url: 'file://' + __dirname + '/../templates/' });
  const compiledTemplate = hogan.compile(styledTemplate);
  const renderedTemplate = compiledTemplate.render({
    greetings: req.t(`email.${type}.greetings`, { name }),
    body: req.t(`email.${type}.body`),
    link: req.t(`email.${type}.link`),
    signature: req.t(`email.${type}.signature`),
    url,
  });

  const mailOptions = {
    from: `"SOS-Tag" <${process.env.GOOGLE_OAUTH_CLIENT_USER}>`,
    to: email,
    subject: `[SOS-Tag] ${req.t(`email.${type}.subject`)}`,
    html: renderedTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export { createConfirmationUrl, createForgotPasswordUrl, sendEmail };
