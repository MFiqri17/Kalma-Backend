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
} from '../../utils/functions/responseFunction';
import {
  createUserPayload,
  forgotPasswordPayload,
  resetPasswordPayload,
  updateUserPayload,
} from '../../utils/types/payload';
import { lowerCase } from 'text-case';

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
    const newUser = await UserService.createUser(userPayload);
    const verificationToken = generateToken(newUser, process.env.EMAIL_VERIFICATION_TOKEN as Secret, '5m');
    EmailService.vericationEmail(newUser, verificationToken);
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
    console.log('Error get user property', error);
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
      EmailService.verificationEmailChanged(updatedUser, verificationToken);
      return res.status(200).json(updateUserResponse(updatedUser, isEmailChanged));
    }
    return res.status(200).json(updateUserResponse(updatedUser, isEmailChanged));
  } catch (error) {
    console.log('Error update user property', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const sendEmailVerification = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    const isEmailVerified = UserService.isEmailVerified(user!.is_verified);
    if (isEmailVerified) return res.status(400).json(emailIsVerifiedResponse());
    const verificationToken = generateToken(user!, process.env.EMAIL_VERIFICATION_TOKEN as Secret, '5m');
    EmailService.verificationEmailAgain(user!, verificationToken);
    return res.status(200).json(sendEmaiResponse());
  } catch (error) {
    console.log('Error send email verification', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    const isEmailVerified = UserService.isEmailVerified(user!.is_verified);
    if (isEmailVerified) return res.status(400).json(emailIsVerifiedResponse());
    await UserService.verifyUserById(user!.id);
    return res.status(200).json(verifyEmailResponse());
  } catch (error) {
    console.log('Error verify email', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email_or_username } = req.body as forgotPasswordPayload;
    const user = await UserService.getUserByEmailOrUsernameOneParams(email_or_username);
    if (!user) return res.status(400).json(invalidCredentialResponse());
    const forgotPasswordToken = generateToken(user, process.env.FORGOT_PASSWORD_TOKEN as Secret, '5m');
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none' });
    EmailService.forgotPasswordEmail(user, forgotPasswordToken);
    return res.status(200).json(forgotPasswordResponse());
  } catch (error) {
    console.log('Error forgot password', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const resetPasswordData = req.body as resetPasswordPayload;
    const isPasswordSame = UserService.checkPasswordConfirmation(resetPasswordData);
    if (!isPasswordSame) return res.status(400).json(passwordDoNotMatch());
    const hashedPassword = await AuthService.hashPassword(resetPasswordData.new_password_confirmation);
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none' });
    await UserService.resetPasswordById(req.user!.id, hashedPassword);
    return res.status(200).json(resetPasswordResponse());
  } catch (error) {
    console.log('Error reset password', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const UserController = {
  createUser,
  getUserProperty,
  updateUserProperty,
  sendEmailVerification,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

export default UserController;
