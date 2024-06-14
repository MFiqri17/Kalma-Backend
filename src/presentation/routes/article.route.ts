/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import AuthMiddleware from '../../middleware/auth.middleware';
import formValidationMiddleware from '../../middleware/formValidation.middleware';
import { upload } from '../../utils/functions/fileFunction';
import UserMiddleware from '../../middleware/user.middleware';
import ArticleController from '../controllers/article.controller';
import { createArticle, updateArticle } from '../../utils/schema/article.schema';

const ArticleRouter = Router();

ArticleRouter.get(
  '/',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.isAccountApproved,
  ArticleController.getArticle,
);

ArticleRouter.post(
  '/',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin', 'psychologist']),
  UserMiddleware.isAccountApproved,
  upload.single('image'),
  formValidationMiddleware(createArticle),
  ArticleController.createArticle,
);

ArticleRouter.get(
  '/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.isAccountApproved,
  ArticleController.getDetailArticle,
);

ArticleRouter.put(
  '/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin', 'psychologist']),
  UserMiddleware.isAccountApproved,
  upload.single('image'),
  formValidationMiddleware(updateArticle),
  ArticleController.updateArticle,
);

ArticleRouter.delete(
  '/:id',
  AuthMiddleware.verifyAccessToken,
  UserMiddleware.isUserEmailVerified,
  UserMiddleware.checkUserRole(['admin', 'psychologist']),
  UserMiddleware.isAccountApproved,
  ArticleController.deleteArticle,
);

export default ArticleRouter;
