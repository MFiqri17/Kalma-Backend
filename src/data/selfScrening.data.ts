import prisma from './prisma';
import { getQueryPayload } from '../utils/types/payload';
import { selfScreeningExtendedPayload } from '../utils/types/types';
import { getFormatDate } from '../utils/functions/conditionFunctions';

const getSelfScreeningTotalDataWithoutCondition = (userId: string) =>
  prisma.screenings.count({
    where: {
      created_by: userId,
    },
  });

const getSelfScreeningDataWithoutCondition = (userId: string) => {
  return prisma.screenings.findMany({
    where: { created_by: userId },
    orderBy: {
      ['created_at']: 'desc',
    },
  });
};

const getSelfCreeningTotalData = (userId: string, whereCondition: object) =>
  prisma.screenings.count({
    where: {
      AND: [{ created_by: userId }, whereCondition],
    },
  });

const createSelfScreening = (screeningData: selfScreeningExtendedPayload, userId: string) =>
  prisma.screenings.create({
    data: {
      created_by: userId,
      created_at: getFormatDate(),
      created_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      ...screeningData,
    },
  });

const getSelfScreeningData = async (userId: string, whereCondition: object, getPayload: Partial<getQueryPayload>) => {
  const { sort_column, sort_value, size, page } = getPayload;
  return prisma.screenings.findMany({
    where: {
      AND: [{ created_by: userId }, whereCondition],
    },
    orderBy: {
      [sort_column || 'created_at']: sort_value || 'desc',
    },
    skip: page && size ? (page - 1) * size : 0,
    take: size || (await getSelfCreeningTotalData(userId, whereCondition)),
  });
};

const getDetailSelfScreening = (userId: string, selfScreeningId: string) =>
  prisma.screenings.findUnique({ where: { created_by: userId, id: selfScreeningId } });

const SelfScreeningData = {
  createSelfScreening,
  getSelfScreeningTotalDataWithoutCondition,
  getSelfScreeningDataWithoutCondition,
  getSelfCreeningTotalData,
  getSelfScreeningData,
  getDetailSelfScreening,
};

export default SelfScreeningData;
