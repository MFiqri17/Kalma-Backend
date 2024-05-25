import { createJournalPayload, getQueryPayload } from '../utils/types/payload';
import { getFormatDate } from '../utils/functions/coditionFunctions';
import prisma from './prisma';

const createJournal = (journalData: createJournalPayload, userId: string) =>
  prisma.journals.create({
    data: {
      created_by: userId,
      created_at: getFormatDate(),
      created_at_formatted: getFormatDate('MMMM Do YYYY, HH:mm:ss'),
      ...journalData,
    },
  });

const getJournalByUserIdWithoutCondition = (userId: string) =>
  prisma.journals.findMany({
    where: { created_by: userId },
    orderBy: {
      ['created_at']: 'desc',
    },
  });

const getJournalTotalByUserIdWithoutCondition = (userId: string) =>
  prisma.journals.count({
    where: { created_by: userId },
  });

const getJournalTotalByUserId = (userId: string, whereCondition: object) =>
  prisma.journals.count({
    where: {
      AND: [{ created_by: userId }, whereCondition],
    },
  });

const getJournalByUserId = async (userId: string, whereCondition: object, getPayload: Partial<getQueryPayload>) => {
  const { sort_column, sort_value, size, page } = getPayload;
  return prisma.journals.findMany({
    where: {
      AND: [{ created_by: userId }, whereCondition],
    },
    orderBy: {
      [sort_column || 'created_at']: sort_value || 'desc',
    },
    skip: page && size ? (page - 1) * size : 0,
    take: size || (await getJournalTotalByUserId(userId, whereCondition)),
  });
};

const getJournalDetailByUserId = (userId: string, journalId: string) =>
  prisma.journals.findUnique({ where: { created_by: userId, id: journalId } });

const JournalingData = {
  createJournal,
  getJournalByUserIdWithoutCondition,
  getJournalTotalByUserIdWithoutCondition,
  getJournalTotalByUserId,
  getJournalByUserId,
  getJournalDetailByUserId,
};

export default JournalingData;
