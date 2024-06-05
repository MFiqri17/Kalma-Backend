import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../utils/types/types';
import {
  emailIsNotVerifiedResponse,
  existedUserResponse,
  forbiddenAccessResponse,
  invalidLinkTokenResponse,
  serverErrorResponse,
} from '../utils/functions/responseFunction';
import { createUserPayload } from '../utils/types/payload';
import { USER_ROLE } from '@prisma/client';

const checkExistingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username } = req.body as createUserPayload;
    const user = await UserService.getUserByEmailOrUsernameTwoParams(email, username);
    if (req.user && user && req.user.id !== user.id) return res.status(400).json(existedUserResponse());
    if (!req.user && user) return res.status(400).json(existedUserResponse());
    next();
  } catch (error) {
    console.error('Error checking existing user:', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const isUserEmailVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    const isEmailVerified = UserService.isEmailVerified(user!.is_verified);
    if (!isEmailVerified) return res.status(403).json(emailIsNotVerifiedResponse());
    next();
  } catch (error) {
    console.error('Error checking verified email:', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const verifyEmailVerificationToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenUser = jwt.verify(req.params.token, process.env.EMAIL_VERIFICATION_TOKEN as Secret) as User;
    req.user = tokenUser;
    next();
  } catch (error) {
    console.error('Error verify link token:', error);
    return res.status(400).json(invalidLinkTokenResponse());
  }
};

const verifyForgotPasswordToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenUser = jwt.verify(req.params.token, process.env.FORGOT_PASSWORD_TOKEN as Secret) as User;
    req.user = tokenUser;
    next();
  } catch (error) {
    console.error('Error verify link token:', error);
    return res.status(400).json(invalidLinkTokenResponse());
  }
};

const checkUserRole = (userRole: USER_ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.getUserById(req.user!.id);
      if (!userRole.includes(user!.role)) return res.status(403).json(forbiddenAccessResponse());
      next();
    } catch (error) {
      console.error('Error verify user role', error);
      return res.status(500).json(serverErrorResponse());
    }
  };
};

const UserMiddleware = {
  checkExistingUser,
  isUserEmailVerified,
  verifyEmailVerificationToken,
  verifyForgotPasswordToken,
  checkUserRole,
};

export default UserMiddleware;
