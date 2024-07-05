/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ENDPOINTS from '../../utils/constant/endpoint';
import JournalingController from '../controllers/journaling.controller';
import AuthMiddleware from '../../middleware/auth.middleware';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { createJournal } from '../../utils/schema/journaling.schema';
import UserMiddleware from '../../middleware/user.middleware';

const JournalingRouter = Router();

// user action for journal
JournalingRouter.post(
  ENDPOINTS.USERS_JOURNAL,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['user']),
  formValidationMiddleware(createJournal),
  JournalingController.createJournal,
);

JournalingRouter.post(
  ENDPOINTS.USERS_JOURNAL,
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['user']),
  JournalingController.getJournalHistory,
);

JournalingRouter.get(
  ENDPOINTS.USERS_JOURNAL + '/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['user']),
  JournalingController.getJournalDetailHistory,
);

// psychologist action for journal
JournalingRouter.get(
  ENDPOINTS.JOURNALS_BY_USER + '/:username_or_fullname',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['psychologist']),
  UserMiddleware.isAccountApproved,
  JournalingController.getUserJournalForPsychologist,
);

JournalingRouter.get(
  ENDPOINTS.JOURNALS_BY_USER + '/:username_or_fullname' + '/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['psychologist']),
  UserMiddleware.isAccountApproved,
  JournalingController.getUserJournalDetailForPsychologist,
);

export default JournalingRouter;
