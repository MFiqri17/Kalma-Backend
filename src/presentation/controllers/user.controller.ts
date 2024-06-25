import { Request, Response } from 'express';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import EmailService from '../../services/email.service';
import { generateToken } from '../../utils/functions/tokenFunction';
import { Secret } from 'jsonwebtoken';
import {
  createUserResponse,
  serverErrorResponse,
  getUserResponse,
  updateUserResponse,
  emailIsVerifiedResponse,
  sendEmaiResponse,
  verifyEmailResponse,
  invalidCredentialResponse,
  forgotPasswordResponse,
  passwordDoNotMatch,
  resetPasswordResponse,
  idNotFoundResponse,
  getUserRoleResponse,
  getPsychologResponse,
  psychologAlreadyApprovedResponse,
  approvePsychologResponse,
  deletePsychologResponse,
} from '../../utils/functions/responseFunction';
import {
  createUserPayload,
  forgotPasswordPayload,
  getQueryPayload,
  resetPasswordPayload,
  updateUserPayload,
} from '../../utils/types/payload';
import { lowerCase } from 'text-case';
import PATH from '../../utils/constant/path';

const createUser = async (req: Request, res: Response) => {
  try {
    const { password, full_name, ...restBodyRequest } = req.body as createUserPayload;
    const hashedPassword = await AuthService.hashPassword(password);
    const lowerCaseName = lowerCase(full_name);
    const userPayload = {
      ...restBodyRequest,
      full_name: lowerCaseName,
      password: hashedPassword,
    };
    const origin = req.get('origin');
    const isOriginPath = origin === process.env.WEB_APP_BASE_DEVELOPMENT || origin === process.env.WEB_APP_BASE_LOCAL;
    if (origin && isOriginPath) {
      const newPsycholog = await UserService.createPsycholog(userPayload);
      const verificationToken = generateToken(newPsycholog, process.env.EMAIL_VERIFICATION_TOKEN as Secret, '5m');
      EmailService.verificationEmail(newPsycholog, verificationToken, PATH.VERIFICATION_EMAIL);
      return res.status(201).json(createUserResponse(newPsycholog));
    }
    const newUser = await UserService.createUser(userPayload);
    const verificationToken = generateToken(newUser, process.env.EMAIL_VERIFICATION_TOKEN as Secret, '5m');
    EmailService.verificationEmail(newUser, verificationToken, PATH.VERIFICATION_EMAIL);
    return res.status(201).json(createUserResponse(newUser));
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getUserProperty = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    if (!user) return res.status(404).json(idNotFoundResponse(req.user!.id));
    return res.status(200).json(getUserResponse(user));
  } catch (error) {
    console.error('Error get user property', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getUserRole = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    if (!user) return res.status(404).json(idNotFoundResponse(req.user!.id));
    return res.status(200).json(getUserRoleResponse(user.role));
  } catch (error) {
    console.error('Error get user role', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const updateUserProperty = async (req: Request, res: Response) => {
  try {
    const { full_name, ...restUserPayload } = req.body as updateUserPayload;
    const userPayload = {
      ...restUserPayload,
      full_name: lowerCase(full_name),
    };
    const userFound = await UserService.getUserById(req.user!.id);
    if (!userFound) return res.status(404).json(idNotFoundResponse(req.user!.id));
    const isEmailChanged = UserService.compareUserEmail(userPayload.email, userFound.email);
    const isUsernameChanged = UserService.compareUserUsername(userPayload.username, userFound.username);
    if (isEmailChanged || isUsernameChanged) res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none' });
    const updatedUser = await UserService.updateUserById(userFound, userPayload);
    if (isEmailChanged) {
      const verificationToken = generateToken(updatedUser, process.env.EMAIL_VERIFICATION_TOKEN as Secret, '5m');
      await UserService.unverifyUserById(userFound.id);
      EmailService.verificationEmailChanged(updatedUser, verificationToken, PATH.VERIFICATION_EMAIL);
      return res.status(200).json(updateUserResponse(updatedUser, isEmailChanged));
    }
    return res.status(200).json(updateUserResponse(updatedUser, isEmailChanged));
  } catch (error) {
    console.error('Error update user property', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const sendEmailVerification = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    const isEmailVerified = UserService.isEmailVerified(user!.is_verified);
    if (isEmailVerified) return res.status(400).json(emailIsVerifiedResponse());
    const verificationToken = generateToken(user!, process.env.EMAIL_VERIFICATION_TOKEN as Secret, '5m');
    EmailService.verificationEmailAgain(user!, verificationToken, PATH.VERIFICATION_EMAIL);
    return res.status(200).json(sendEmaiResponse());
  } catch (error) {
    console.error('Error send email verification', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    const isEmailVerified = UserService.isEmailVerified(user!.is_verified);
    if (isEmailVerified) return res.status(400).json(emailIsVerifiedResponse());
    const verifiedUser = await UserService.verifyUserById(user!.id);
    if (verifiedUser.role === 'psychologist') EmailService.waitingForApprovalEmail(verifiedUser);
    const accessToken = generateToken(verifiedUser, process.env.ACCESS_TOKEN as Secret, '15m');
    const refreshToken = generateToken(verifiedUser, process.env.REFRESH_TOKEN as Secret, '1d');
    return res.status(200).json(verifyEmailResponse(accessToken, refreshToken));
  } catch (error) {
    console.error('Error verify email', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email_or_username } = req.body as forgotPasswordPayload;
    const user = await UserService.getUserByEmailOrUsernameOneParams(email_or_username);
    if (!user) return res.status(400).json(invalidCredentialResponse());
    const forgotPasswordToken = generateToken(user, process.env.FORGOT_PASSWORD_TOKEN as Secret, '5m');
    EmailService.forgotPasswordEmail(user, forgotPasswordToken, PATH.FORGOT_PASSWORD);
    return res.status(200).json(forgotPasswordResponse());
  } catch (error) {
    console.error('Error forgot password', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const resetPasswordData = req.body as resetPasswordPayload;
    const isPasswordSame = UserService.checkPasswordConfirmation(resetPasswordData);
    if (!isPasswordSame) return res.status(400).json(passwordDoNotMatch());
    const hashedPassword = await AuthService.hashPassword(resetPasswordData.new_password_confirmation);
    const resetedPassword = await UserService.resetPasswordById(req.user!.id, hashedPassword);
    const accessToken = generateToken(resetedPassword, process.env.ACCESS_TOKEN as Secret, '15m');
    const refreshToken = generateToken(resetedPassword, process.env.REFRESH_TOKEN as Secret, '1d');
    return res.status(200).json(resetPasswordResponse(accessToken, refreshToken));
  } catch (error) {
    console.error('Error reset password', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getPsycholog = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getPscycholog(req.body as getQueryPayload);
    return res.status(200).json(getPsychologResponse(user, req.body as getQueryPayload));
  } catch (error) {
    console.error('Error get psycholog', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const approvePsycholog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundPsycholog = await UserService.getUserById(id);
    if (!foundPsycholog) return res.status(404).json(idNotFoundResponse(id));
    if (foundPsycholog.is_approved)
      return res.status(400).json(psychologAlreadyApprovedResponse(foundPsycholog.full_name));
    const approvedPsycholog = await UserService.approvePsycholog(id);
    return res.status(200).json(approvePsychologResponse(approvedPsycholog.full_name));
  } catch (error) {
    console.error('Error approve psycholog', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const deletePsycholog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundPsycholog = await UserService.getUserById(id);
    if (!foundPsycholog) return res.status(404).json(idNotFoundResponse(id));
    const deletedPsycholog = await UserService.deletePsycholog(id);
    return res.status(200).json(deletePsychologResponse(deletedPsycholog.full_name));
  } catch (error) {
    console.error('Error delete psycholog', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const UserController = {
  createUser,
  getUserProperty,
  getUserRole,
  updateUserProperty,
  sendEmailVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getPsycholog,
  approvePsycholog,
  deletePsycholog,
};

export default UserController;
