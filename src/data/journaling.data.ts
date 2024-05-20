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

const getJournalForUserWithoutCondition = (userId: string) =>
  prisma.journals.findMany({
    where: { created_by: userId },
    orderBy: {
      ['created_at']: 'desc',
    },
  });

const getJournalTotalForUserWithoutCondition = (userId: string) =>
  prisma.journals.count({
    where: { created_by: userId },
  });

const getJournalTotalForUser = (userId: string, whereCondition: object) =>
  prisma.journals.count({
    where: {
      AND: [{ created_by: userId }, whereCondition],
    },
  });

const getJournalForUser = async (userId: string, whereCondition: object, getPayload: Partial<getQueryPayload>) => {
  const { sort_column, sort_value, size, page } = getPayload;
  return prisma.journals.findMany({
    where: {
      AND: [{ created_by: userId }, whereCondition],
    },
    orderBy: {
      [sort_column || 'created_at']: sort_value || 'desc',
    },
    skip: page && size ? (page - 1) * size : 0,
    take: size || (await getJournalTotalForUser(userId, whereCondition)),
  });
};

const getJournalDetailForUser = (userId: string, journalId: string) =>
  prisma.journals.findUnique({ where: { created_by: userId, id: journalId } });

const getJournalTotalByUserWithoutCondition = () =>
  prisma.journals.groupBy({
    where: {
      user: { user_privacy: false },
    },
    by: ['created_by'],
    _count: true,
  });

const getJournalByUserWithoutCondition = () =>
  prisma.users.findMany({
    where: {
      user_privacy: false,
    },
    include: {
      Journals: true,
    },
  });

// const getJournalTotalByUser = async (whereCondition: {}) =>
//   prisma.journals.groupBy({
//     where: {
//       user: { AND: [{ user_privacy: false }, whereCondition] },
//     },
//     by: ['created_by'],
//     _count: true,
//   });

// const getJournalByUser = async (whereCondition: {}, getPayload: Partial<getQueryPayload>) => {
//   const { sort_column, sort_value, size, page } = getPayload;
//   return prisma.users.findMany({
//     where: {
//       AND: [{ user_privacy: false }, whereCondition],
//     },
//     orderBy: {
//       [sort_column || 'full_name']: sort_value || 'asc',
//     },
//     skip: page && size ? (page - 1) * size : 0,
//     take: size || (await getJournalTotalByUser(whereCondition)),
//   });
// };

const JournalingData = {
  createJournal,
  getJournalForUserWithoutCondition,
  getJournalTotalForUserWithoutCondition,
  getJournalTotalForUser,
  getJournalForUser,
  getJournalDetailForUser,
  getJournalTotalByUserWithoutCondition,
  getJournalByUserWithoutCondition,
};

export default JournalingData;
