import nodemailer from 'nodemailer';
import path from 'path';
import { capitalizeFirstLetter } from './formatTextFunction';
import { capitalCase } from 'text-case';
import { User } from '../types/types';
import { t } from 'i18next';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.KALMA_EMAIL,
    pass: process.env.KALMA_PASSWORD,
  },
});

export const emailOptions = (to: string, subject: string, text: string) => {
  return {
    from: process.env.KALMA_EMAIL,
    to: to,
    subject: subject,
    html: text,
    attachments: [
      {
        filename: 'kalma_header.png',
        path: path.join(process.cwd(), 'public/images/kalma_email_header.png'),
        cid: 'kalma_header',
      },
    ],
  };
};

export const sendMail = (to: string, subject: string, text: string) => {
  transporter.sendMail(emailOptions(to, subject, text), (error, info) => {
    if (error) {
      throw new Error(error.message);
    }
    console.log(info.response);
  });
};

export const htmlGenerator = (
  title: string,
  greeting: string,
  content: string,
  closing: string,
  isButton: boolean,
  link?: string,
  buttonText?: string,
) => {
  const buttonMarkup = isButton
    ? `<div style="display: flex; justify-content: center;"><a href="${link}">${buttonText}</a></div>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        main {
          width: 666px !important;
          margin: 0 auto;
        }
        h1 {
          color: #090914;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 40px;
        }
        h2 {
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: medium;
        }
        p {
          color: #666666;
          font-weight: medium;
        }
        a {
          display: inline-block;
          color: #ffffff !important;
          text-decoration: none;
          background-color: #2f9296;
          border-radius: 20px;
          width: 332px !important;
          font-size: 18px !important;
          text-align: center;
          line-height: 48px;
          margin: 48px auto;
          padding: 0px !important;
        }
        img {
          width: 100%;
          height: 100%;
        }
        section {
          padding: 40px;
          font-size: 18px;
          color: #000000;
        }
        #kalma {
          margin: 0px !important;
          padding: 0px !important;
        }

        @media only screen and (max-width: 500px) {
          a {
            width: 100%;
            font-size: 16px !important;
          }
          h2 {
            font-size: 16px !important;
          }
          img {
            height: 'auto';
          }
          h1 {
            font-size: 20px !important;
          }
          section {
            padding: 20px !important;
            font-size: 16px !important;
          }
        }
      </style>
    </head>
      <body>
        <main>
          <img src="cid:kalma_header" alt="kalma header" />
          <section>
            <h1>${title}</h1>
            <h2>${greeting}</h2>
            <p>${content}</p>
            ${buttonMarkup}
            <p id="kalma">${closing}</p>
            <p id="kalma">Kalma Team.</p>
          </section>
        </main>
      </body>
    </html>`;
};

export const sendEmail = (
  user: Pick<User, 'username' | 'email'>,
  templateKey: string,
  withButton: boolean,
  path?: string,
  token?: string,
) => {
  const header = capitalCase(t(`${templateKey}.HEADER`));
  const title = capitalizeFirstLetter(t(`${templateKey}.TITLE`));
  const greeting = capitalizeFirstLetter(t('EMAILRESPONSE.GREETING', { USERNAME: user.username }));
  const content = capitalizeFirstLetter(t(`${templateKey}.CONTENT`));
  const closing = capitalizeFirstLetter(t('EMAILRESPONSE.CLOSING'));

  let emailContent;

  if (withButton) {
    const buttonText = capitalizeFirstLetter(t(`${templateKey}.BUTTONTEXT`));
    const link = `${path}/${token}`;
    emailContent = htmlGenerator(title, greeting, content, closing, true, link, buttonText);
  } else {
    emailContent = htmlGenerator(title, greeting, content, closing, false);
  }

  sendMail(user.email, header, emailContent);
};
