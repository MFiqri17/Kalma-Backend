import { sendEmail } from '../utils/functions/emailFunction';
import { User } from '../utils/types/types';

const verificationEmail = (user: Pick<User, 'username' | 'email'>, token: string, link: string) =>
  sendEmail(user, 'EMAILRESPONSE.VERIFICATIONEMAIL', true, link, token);

const verificationEmailChanged = (user: Pick<User, 'username' | 'email'>, token: string, link: string) =>
  sendEmail(user, 'EMAILRESPONSE.VERIFICATIONEMAILCHANGED', true, link, token);

const verificationEmailAgain = (user: Pick<User, 'username' | 'email'>, token: string, link: string) =>
  sendEmail(user, 'EMAILRESPONSE.VERIFICATIONEMAILAGAIN', true, link, token);

const forgotPasswordEmail = (user: Pick<User, 'username' | 'email'>, token: string, link: string) =>
  sendEmail(user, 'EMAILRESPONSE.FORGOTPASSWORDEMAIL', true, link, token);

const waitingForApprovalEmail = (user: Pick<User, 'username' | 'email'>) =>
  sendEmail(user, 'EMAILRESPONSE.WAITINGFORAPPROVALEMAIL', false);

const EmailService = {
  verificationEmail,
  verificationEmailChanged,
  verificationEmailAgain,
  forgotPasswordEmail,
  waitingForApprovalEmail,
};

export default EmailService;
