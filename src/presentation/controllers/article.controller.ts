import { Request, Response } from 'express';
import { createArticlePayload, getQueryPayload, updateArticlePayload } from '../../utils/types/payload';
import {
  createArticleResponse,
  deleteArticleResponse,
  getArticleDetailResponse,
  getArticleResponse,
  handleErrorEmptyDataResponse,
  idNotFoundResponse,
  serverErrorResponse,
  updateArticleResponse,
} from '../../utils/functions/responseFunction';
import { Prisma } from '@prisma/client';
import ArticleService from '../../services/article.service';

const createArticle = async (req: Request, res: Response) => {
  try {
    const createdArticle = await ArticleService.createArticle(req.body as createArticlePayload, req.user!.id);
    return res.status(200).json(createArticleResponse(createdArticle));
  } catch (error) {
    console.error('error create article', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getArticle = async (req: Request, res: Response) => {
  try {
    const articleData = await ArticleService.getArticles(req.body as getQueryPayload);
    return res.status(200).json(getArticleResponse(articleData, req.body as getQueryPayload));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError)
      return res.status(200).json(handleErrorEmptyDataResponse(req.body as getQueryPayload));
    console.error('error get article', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const getDetailArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundArticle = await ArticleService.getDetailArticleById(id);
    if (!foundArticle) return res.status(404).json(idNotFoundResponse(id));
    res.status(200).json(getArticleDetailResponse(foundArticle));
  } catch (error) {
    console.error('error get detail article', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundArticle = await ArticleService.getDetailArticleById(id);
    if (!foundArticle) return res.status(404).json(idNotFoundResponse(id));
    const updatedArticle = await ArticleService.updateArticleById(
      foundArticle,
      req.body as updateArticlePayload,
      req.user!.id,
    );
    res.status(200).json(updateArticleResponse(updatedArticle));
  } catch (error) {
    console.error('error update article', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundArticle = await ArticleService.getDetailArticleById(id);
    if (!foundArticle) return res.status(404).json(idNotFoundResponse(id));
    const deletedArticle = await ArticleService.deleteArticleById(foundArticle.id, foundArticle?.image);
    res.status(200).json(deleteArticleResponse(deletedArticle.id));
  } catch (error) {
    console.error('error delete article', error);
    return res.status(500).json(serverErrorResponse());
  }
};

const ArticleController = {
  createArticle,
  getArticle,
  getDetailArticle,
  updateArticle,
  deleteArticle,
};

export default ArticleController;
