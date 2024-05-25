import { Request, Response } from 'express';
import UserService from '../../services/user.service';
import { generateToken } from '../../utils/functions/tokenFunction';
import { Secret } from 'jsonwebtoken';
import {
  refreshTokenConfigResponse,
  serverErrorResponse,
  tokenUserResponse,
} from '../../utils/functions/responseFunction';

const authenticateUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    await UserService.updateLastLoggedInById(user!.id);
    const accessToken = generateToken(user!, process.env.ACCESS_TOKEN as Secret, '15m');
    const refreshToken = generateToken(user!, process.env.REFRESH_TOKEN as Secret, '1d');
    console.log('generated refresh token', refreshToken);
    console.log('ip of request', req.ip);
    console.log('url of request', req.url);
    res.cookie('refreshToken', refreshToken, refreshTokenConfigResponse());
    return res.status(200).json(tokenUserResponse(accessToken, user!.is_verified, true));
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const refreshUserToken = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);
    const accessToken = generateToken(user!, process.env.ACCESS_TOKEN as Secret, '15m');
    const refreshToken = generateToken(user!, process.env.REFRESH_TOKEN as Secret, '1d');
    res.cookie('refreshToken', refreshToken, refreshTokenConfigResponse());
    return res.status(200).json(tokenUserResponse(accessToken, user!.is_verified, false));
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const AuthController = {
  authenticateUser,
  refreshUserToken,
};

export default AuthController;
