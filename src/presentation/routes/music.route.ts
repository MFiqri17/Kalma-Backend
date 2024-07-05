/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import AuthMiddleware from '../../middleware/auth.middleware';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { createMusicSchema, updateMusicSchema } from '../../utils/schema/music.schema';
import MusicController from '../controllers/music.controller';
import { upload } from '../../utils/functions/fileFunction';
import UserMiddleware from '../../middleware/user.middleware';

const MusicRouter = Router();

MusicRouter.post(
  '/get',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.isAccountApproved,
  MusicController.getMusic,
);

MusicRouter.post(
  '/create',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin', 'psychologist']),
  UserMiddleware.isAccountApproved,
  upload.single('music_file'),
  formValidationMiddleware(createMusicSchema),
  MusicController.createMusic,
);

MusicRouter.get(
  '/get/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.isAccountApproved,
  MusicController.getDetailMusic,
);

MusicRouter.put(
  '/update/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin', 'psychologist']),
  UserMiddleware.isAccountApproved,
  upload.single('music_file'),
  formValidationMiddleware(updateMusicSchema),
  MusicController.updateMusic,
);

MusicRouter.delete(
  '/delete/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin', 'psychologist']),
  UserMiddleware.isAccountApproved,
  MusicController.deleteMusic,
);

export default MusicRouter;
