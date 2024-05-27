/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import AuthMiddleware from '../../middleware/auth.middleware';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { createMusicSchema } from '../../utils/schema/music.schema';
import MusicController from '../controllers/music.controller';
import { upload } from '../../utils/functions/fileFunction';

const MusicRouter = Router();

MusicRouter.post(
  '/',
  upload.single('music_file'),
  AuthMiddleware.verifyAccessToken,
  formValidationMiddleware(createMusicSchema),
  MusicController.createMusic,
);

export default MusicRouter;
