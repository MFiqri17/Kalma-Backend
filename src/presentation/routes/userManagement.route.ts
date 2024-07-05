/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ENDPOINTS from '../../utils/constant/endpoint';
import AuthMiddleware from '../../middleware/auth.middleware';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../../middleware/user.middleware';

const UserManagementRouter = Router();

UserManagementRouter.post(
  '/',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin']),
  UserMiddleware.isAccountApproved,
  UserController.getPsycholog,
);

UserManagementRouter.patch(
  `${ENDPOINTS.APPROVE_PSYCHOLOG}/:id`,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin']),
  UserMiddleware.isAccountApproved,
  UserController.approvePsycholog,
);

UserManagementRouter.delete(
  `${ENDPOINTS.DELETE_PSYCHOLOG}/:id`,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin']),
  UserMiddleware.isAccountApproved,
  UserController.deletePsycholog,
);

export default UserManagementRouter;
