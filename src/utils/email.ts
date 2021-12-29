import { confirmUserPrefix, forgotPasswordPrefix } from '@constants/redis-prefixes';
import { Request } from 'express';
import { google } from 'googleapis';
import { nanoid } from 'nanoid';
import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
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

const generateEmailHTMLTemplate = (type: EmailAim, name: string, url: string, req: Request) => {
  return `<div style="margin: 0 auto; font-family: Helvetica, sans-serif; color: #333333; text-align: center; max-width: 520px; padding: 0 20px">
  <div style="text-align: center; padding: 50px 0">
    <a rel="noopener noreferrer" href="http://localhost:3000">
      <img alt="SOS-Tag" width="100px" src="cid:sos-tag-logo">
    </a>
  </div>
  <div style="font-size: 16px; text-align: left">
    <div style="line-height: 150%">
      <div style="font-size: 20px">${req.t(`email.${type}.greetings`, { name })},</div>
      <div style="margin: 15px 0">
        ${req.t(`email.${type}.body`)}
      </div>
    </div>
    <div>
      <a style="background: #0B1F50; padding: 10px 14px; min-width: 200px; color: #fff; text-decoration: none; display: inline-block; font-weight:bold; text-align:center; letter-spacing: 0.5px; border-radius:4px" href=${url}>
        ${req.t(`email.${type}.link`)}
      </a>
    </div>
    <div style="line-height: 150%">
      <div style="color: #828282; margin: 15px 0 75px">
        - ${req.t(`email.${type}.footer`)}
      </div>
    </div>
  </div>`;
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

  const mailOptions = {
    from: `"SOS-Tag" <${process.env.GOOGLE_OAUTH_CLIENT_USER}>`,
    to: email,
    // to: 'dofel82126@saturdata.com',
    subject: `[SOS-Tag] ${req.t(`email.${type}.subject`)}`,
    html: generateEmailHTMLTemplate(type, name, url, req),
    attachments: [
      {
        filename: 'sos-tag-logo.png',
        path: `${__dirname}/../assets/images/sos-tag-logo.png`,
        cid: 'sos-tag-logo',
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account, otherwise return false
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

export { createConfirmationUrl, createForgotPasswordUrl, sendEmail };
