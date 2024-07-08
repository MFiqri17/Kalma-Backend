import ArticleData from '../data/article.data';
import { getArticleWhereConditionFunction } from '../utils/functions/conditionFunctions';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/functions/fileFunction';
import { createArticlePayload, getQueryPayload, updateArticlePayload } from '../utils/types/payload';
import { Article } from '../utils/types/types';

const createArticle = async (articleData: createArticlePayload, userId: string) => {
  let image_url: string | undefined;
  if (articleData.image) {
    const url_result = await uploadToCloudinary(articleData.image.buffer, articleData.image.mimetype);
    image_url = url_result.secure_url;
  } else {
    image_url = undefined;
  }
  return ArticleData.createArticle(articleData, userId, image_url);
};

const getArticles = async (getPayload?: Partial<getQueryPayload>) => {
  if (getPayload && Object.keys(getPayload).length > 0) {
    console.log(getPayload);
    const whereCondition = getArticleWhereConditionFunction(getPayload);
    console.log(whereCondition);
    const [totalCount, data] = await Promise.all([
      ArticleData.getArticleTotalData(whereCondition),
      ArticleData.getArticleData(whereCondition, getPayload),
    ]);
    return { totalCount, data };
  }
  const [totalCount, data] = await Promise.all([
    ArticleData.getArticleTotalDataWithoutCondition(),
    ArticleData.getArticleDataWithoutCondition(),
  ]);
  return { totalCount, data };
};

const getDetailArticleById = (articleId: string) => ArticleData.getDetailArticleDataById(articleId);

const deleteArticleById = async (articleId: string, imageLink: string | null) => {
  if (imageLink) await deleteFromCloudinary(imageLink);
  return ArticleData.deleteArticleDataById(articleId);
};

const updateArticleById = async (articleFound: Article, articleData: updateArticlePayload, userId: string) => {
  let image_url: string | null | undefined;
  if (articleData.image) {
    if (articleFound.image) await deleteFromCloudinary(articleFound.image);
    const url_result = await uploadToCloudinary(articleData.image.buffer, articleData.image.mimetype);
    image_url = url_result.secure_url;
  } else {
    image_url = articleFound.image;
  }
  return ArticleData.updateArticle(articleData, articleFound.id, userId, image_url);
};

const ArticleService = {
  createArticle,
  getArticles,
  getDetailArticleById,
  deleteArticleById,
  updateArticleById,
};

export default ArticleService;
