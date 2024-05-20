import { sendEmail } from '../utils/functions/emailFunction';
import { User } from '../utils/types/types';
import PATH from '../utils/constant/path';

const vericationEmail = (user: Pick<User, 'username' | 'email'>, token: string) =>
  sendEmail(user, 'EMAILRESPONSE.VERIFICATIONEMAIL', true, PATH.VERIFICATION_EMAIL, token);

const verificationEmailChanged = (user: Pick<User, 'username' | 'email'>, token: string) =>
  sendEmail(user, 'EMAILRESPONSE.VERIFICATIONEMAILCHANGED', true, PATH.VERIFICATION_EMAIL, token);

const verificationEmailAgain = (user: Pick<User, 'username' | 'email'>, token: string) =>
  sendEmail(user, 'EMAILRESPONSE.VERIFICATIONEMAILAGAIN', true, PATH.VERIFICATION_EMAIL, token);

const forgotPasswordEmail = (user: Pick<User, 'username' | 'email'>, token: string) =>
  sendEmail(user, 'EMAILRESPONSE.FORGOTPASSWORDEMAIL', true, PATH.FORGOT_PASSWORD, token);

const EmailService = {
  vericationEmail,
  verificationEmailChanged,
  verificationEmailAgain,
  forgotPasswordEmail,
};

export default EmailService;
