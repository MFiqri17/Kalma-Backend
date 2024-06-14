import { lowerCase } from 'text-case';
import { getFormatDate } from '../utils/functions/conditionFunctions';
import { createArticlePayload, getQueryPayload, updateArticlePayload } from '../utils/types/payload';
import prisma from './prisma';

const createArticle = (articlePayload: createArticlePayload, userId: string, image_url?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, title, article_type, content, ...restData } = articlePayload;
  return prisma.articles.create({
    data: {
      created_by: userId,
      created_at: getFormatDate(),
      created_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      modified_by: userId,
      modified_at: getFormatDate(),
      modified_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      image: image_url,
      title: lowerCase(title),
      article_type: article_type.map((data) => lowerCase(data)),
      content: content.map((data) => lowerCase(data)),
      ...restData,
    },
  });
};

const getArticleTotalDataWithoutCondition = () => prisma.articles.count();
const getArticleDataWithoutCondition = () =>
  prisma.articles.findMany({
    select: {
      id: true,
      title: true,
      image: true,
      content: true,
      article_type: true,
      created_at_formatted: true,
      modified_at_formatted: true,
      user: {
        select: {
          full_name: true,
        },
      },
      modifiedUser: {
        select: {
          full_name: true,
        },
      },
    },
    orderBy: {
      ['created_at']: 'desc',
    },
  });

const getArticleTotalData = (whereCondition: object) =>
  prisma.articles.count({
    where: whereCondition,
  });

const getArticleData = async (whereCondition: object, getPayload: Partial<getQueryPayload>) => {
  const { sort_column, sort_value, size, page } = getPayload;
  return prisma.articles.findMany({
    where: whereCondition,
    select: {
      id: true,
      title: true,
      image: true,
      content: true,
      article_type: true,
      created_at_formatted: true,
      modified_at_formatted: true,
      user: {
        select: {
          full_name: true,
        },
      },
      modifiedUser: {
        select: {
          full_name: true,
        },
      },
    },
    orderBy: {
      [sort_column || 'created_at']: sort_value || 'desc',
    },
    skip: page && size ? (page - 1) * size : 0,
    take: size || (await getArticleTotalData(whereCondition)),
  });
};

const getDetailArticleDataById = (articleId: string) =>
  prisma.articles.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      image: true,
      content: true,
      article_type: true,
      created_at_formatted: true,
      modified_at_formatted: true,
      user: {
        select: {
          full_name: true,
        },
      },
      modifiedUser: {
        select: {
          full_name: true,
        },
      },
    },
  });

const deleteArticleDataById = (articleId: string) => prisma.articles.delete({ where: { id: articleId } });

const updateArticle = (
  articlePayload: updateArticlePayload,
  articleId: string,
  userId: string,
  image_url?: string | null,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, title, article_type, content, ...restData } = articlePayload;
  return prisma.articles.update({
    where: { id: articleId },
    data: {
      modified_by: userId,
      modified_at: getFormatDate(),
      modified_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      image: image_url,
      title: lowerCase(title),
      article_type: article_type.map((data) => lowerCase(data)),
      content: content.map((data) => lowerCase(data)),
      ...restData,
    },
  });
};

const ArticleData = {
  createArticle,
  updateArticle,
  getArticleTotalDataWithoutCondition,
  getArticleDataWithoutCondition,
  getArticleTotalData,
  getArticleData,
  getDetailArticleDataById,
  deleteArticleDataById,
};

export default ArticleData;
