import { confirmAccountPrefix, forgotPasswordPrefix } from '@constants/redis-prefixes';
import nodemailer from 'nodemailer';
import { v4 } from 'uuid';
import { redis } from '../redis';

const createConfirmationUrl = async (accountId: string) => {
  const token = v4();
  await redis.set(confirmAccountPrefix + token, accountId, 'ex', 60 * 60 * 24); // 1 day expiration

  // Must correspond to the dedicated route on the frontend
  return `http://localhost:3000/user/confirm/${token}`;
};

const createForgotPasswordUrl = async (accountId: string) => {
  const token = v4();
  await redis.set(forgotPasswordPrefix + token, accountId, 'ex', 60 * 60 * 24); // 1 day expiration

  // Must correspond to the dedicated route on the frontend
  return `http://localhost:3000/user/change-password/${token}`;
};

const sendEmail = async (recipientEmail: string, subject: string, url: string): Promise<void> => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if we don't have a real mail account
  const testAccount = await nodemailer.createTestAccount();

  // Create a reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const mailOptions = {
    from: '"SOS-Tag ➕" <sos-tag@gmail.com>', // sender address
    to: recipientEmail,
    subject: `SOS-Tag - ${subject}`, // Subject line
    // text: 'Hello world?', // plain text body
    html: `<a href="${url}">${url}</a>`,
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

export { createConfirmationUrl, createForgotPasswordUrl, sendEmail };
