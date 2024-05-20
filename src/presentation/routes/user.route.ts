/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import UserMiddleware from '../../middleware/user.middleware';
import AuthMiddleware from '../../middleware/auth.middleware';
import UserController from '../controllers/user.controller';
import AuthController from '../controllers/auth.controller';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import {
  createUserSchema,
  authenticateUserSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../utils/schema/user.schema';
import ENDPOINTS from '../../utils/constant/endpoint';
import { upload } from '../../utils/functions/fileFunction';

const UserRouter = Router();

UserRouter.post(
  ENDPOINTS.REGISTER,
  upload.single('avatar'),
  formValidationMiddleware(createUserSchema),
  UserMiddleware.checkExistingUser,
  UserController.createUser,
);
UserRouter.post(
  ENDPOINTS.LOGIN,
  formValidationMiddleware(authenticateUserSchema),
  AuthMiddleware.checkUserCredentials,
  AuthController.authenticateUser,
);
UserRouter.put(
  ENDPOINTS.UPDATE_USER_PROPERTY,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.checkExistingUser,
  upload.single('avatar'),
  formValidationMiddleware(updateUserSchema),
  UserController.updateUserProperty,
);
UserRouter.post(
  ENDPOINTS.SEND_VERIFICATION_EMAIL,
  AuthMiddleware.verifyAccessToken,
  UserController.sendEmailVerification,
);
UserRouter.post(
  ENDPOINTS.FORGOT_PASSWORD,
  formValidationMiddleware(forgotPasswordSchema),
  UserController.forgotPassword,
);
UserRouter.patch(
  `${ENDPOINTS.RESET_PASWORD}/:token`,
  formValidationMiddleware(resetPasswordSchema),
  UserMiddleware.verifyForgotPasswordToken,
  UserController.resetPassword,
);
UserRouter.get(ENDPOINTS.GET_USER_PROPERTY, AuthMiddleware.verifyAccessToken, UserController.getUserProperty);
UserRouter.get(ENDPOINTS.REFRESH_TOKEN, AuthMiddleware.verifyRefreshToken, AuthController.refreshUserToken);
UserRouter.get(
  `${ENDPOINTS.VERIFY_EMAIL}/:token`,
  UserMiddleware.verifyEmailVerificationToken,
  UserController.verifyEmail,
);

export default UserRouter;
