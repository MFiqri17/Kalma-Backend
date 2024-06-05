import JournalingData from '../data/journaling.data';
import { getWhereConditionFunction } from '../utils/functions/conditionFunctions';
import { createJournalPayload, getQueryPayload } from '../utils/types/payload';

const createJournal = (journalData: createJournalPayload, userId: string) =>
  JournalingData.createJournal(journalData, userId);

const getJournalsByUserId = async (userId: string, getPayload?: Partial<getQueryPayload>) => {
  if (getPayload) {
    const allColumns = ['emotion', 'content', 'created_at_formatted'];
    const whereCondition = getWhereConditionFunction(getPayload, allColumns);
    const [totalCount, data] = await Promise.all([
      JournalingData.getJournalTotalByUserId(userId, whereCondition),
      JournalingData.getJournalByUserId(userId, whereCondition, getPayload),
    ]);
    return { totalCount, data };
  }
  const [totalCount, data] = await Promise.all([
    JournalingData.getJournalTotalByUserIdWithoutCondition(userId),
    JournalingData.getJournalByUserIdWithoutCondition(userId),
  ]);
  return { totalCount, data };
};

const getDetailJournalByUserId = (userId: string, journalId: string) =>
  JournalingData.getJournalDetailByUserId(userId, journalId);

const JournalingService = {
  createJournal,
  getJournalsByUserId,
  getDetailJournalByUserId,
};

export default JournalingService;
