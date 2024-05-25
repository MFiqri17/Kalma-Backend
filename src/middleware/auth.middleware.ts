import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../utils/types/types';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import {
  invalidAccessTokenResponse,
  invalidCredentialResponse,
  invalidRefreshTokenResponse,
  serverErrorResponse,
} from '../utils/functions/responseFunction';
import { authenticateUserPayload } from '../utils/types/payload';

const checkUserCredentials = async (req: Request, res: Response, next: NextFunction) => {
  const { email_or_username, password } = req.body as authenticateUserPayload;
  const user = await UserService.getUserByEmailOrUsernameOneParams(email_or_username);
  if (!user || !(await AuthService.comparePassword(password, user.password)))
    return res.status(400).json(invalidCredentialResponse());
  try {
    req.user = user;
    next();
  } catch (error) {
    console.log('Error verify user credentials', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) return res.status(401).json(invalidAccessTokenResponse());
  const [, token] = bearer.split(' ');
  if (!token) return res.status(401).json(invalidAccessTokenResponse());
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN as Secret) as User;
    const userExisted = user && (await UserService.getUserById(user.id));
    if (!userExisted) return res.status(401).json(invalidAccessTokenResponse());
    req.user = userExisted!;
    next();
  } catch (error) {
    console.log('Error verify access Token', error);
    return res.status(401).json(invalidAccessTokenResponse());
  }
};

const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  console.log('cookies from refresh token', cookies);
  if (!cookies?.refreshToken) return res.status(401).json(invalidRefreshTokenResponse());
  const refreshToken = cookies?.refreshToken as string;
  if (!refreshToken) return res.status(401).json(invalidRefreshTokenResponse());
  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN as Secret) as User;
    const userExisted = user && (await UserService.getUserById(user.id));
    if (!userExisted) return res.status(401).json(invalidRefreshTokenResponse());
    req.user = userExisted!;
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none' });
    next();
  } catch (error) {
    console.log('Error verify refresh Token', error);
    return res.status(401).json(invalidRefreshTokenResponse());
  }
};

const AuthMiddleware = {
  checkUserCredentials,
  verifyAccessToken,
  verifyRefreshToken,
};

export default AuthMiddleware;
