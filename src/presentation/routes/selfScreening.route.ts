/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ENDPOINTS from '../../utils/constant/endpoint';
import AuthMiddleware from '../../middleware/auth.middleware';
import SelfScreeningController from '../controllers/selfScreening.controller';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { selfScreeningTestSchema } from '../../utils/schema/selfScreening.schema';
import UserMiddleware from '../../middleware/user.middleware';

const SelfScreeningRouter = Router();

SelfScreeningRouter.post(
  ENDPOINTS.CREATE_SELF_SCREENING,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['user']),
  formValidationMiddleware(selfScreeningTestSchema),
  SelfScreeningController.createSelfScreening,
);

SelfScreeningRouter.get(
  ENDPOINTS.GET_SELF_SCREENING,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['user']),
  SelfScreeningController.getSelfScreeningHistory,
);

SelfScreeningRouter.get(
  ENDPOINTS.GET_SELF_SCREENING + '/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['user']),
  SelfScreeningController.getDetailSelfScreeningHistory,
);

export default SelfScreeningRouter;
