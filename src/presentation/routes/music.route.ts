/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import AuthMiddleware from '../../middleware/auth.middleware';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { createMusicSchema, updateMusicSchema } from '../../utils/schema/music.schema';
import MusicController from '../controllers/music.controller';
import { upload } from '../../utils/functions/fileFunction';
import MusicMiddleware from '../../middleware/music.middleware';

const MusicRouter = Router();

MusicRouter.post(
  '/',
  upload.single('music_file'),
  AuthMiddleware.verifyAccessToken,
  formValidationMiddleware(createMusicSchema),
  MusicMiddleware.checkExistingMusic,
  MusicController.createMusic,
);
MusicRouter.get('/', AuthMiddleware.verifyAccessToken, MusicController.getMusic);
MusicRouter.get('/:id', AuthMiddleware.verifyAccessToken, MusicController.getDetailMusic);
MusicRouter.put(
  '/:id',
  upload.single('music_file'),
  AuthMiddleware.verifyAccessToken,
  formValidationMiddleware(updateMusicSchema),
  MusicMiddleware.checkExistingMusic,
  MusicController.updateMusic,
);
MusicRouter.delete('/:id', AuthMiddleware.verifyAccessToken, MusicController.deleteMusic);
export default MusicRouter;
