/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ENDPOINTS from '../../utils/constant/endpoint';
import JournalingController from '../controllers/journaling.controller';
import AuthMiddleware from '../../middleware/auth.middleware';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { createJournal } from '../../utils/schema/journaling.schema';

const JournalingRouter = Router();

// user action for journal
JournalingRouter.post(
  ENDPOINTS.USERS_JOURNAL,
  AuthMiddleware.verifyAccessToken,
  formValidationMiddleware(createJournal),
  JournalingController.createJournal,
);

export default JournalingRouter;
