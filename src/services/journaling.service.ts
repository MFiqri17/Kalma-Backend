import JournalingData from '../data/journaling.data';
import { getWhereConditionFunction } from '../utils/functions/coditionFunctions';
import { createJournalPayload, getQueryPayload } from '../utils/types/payload';

const createJournal = (journalData: createJournalPayload, userId: string) =>
  JournalingData.createJournal(journalData, userId);

const getJournals = async (userId: string, getPayload?: Partial<getQueryPayload>) => {
  if (getPayload) {
    const allColumns = ['emotion', 'content', 'created_at_formatted'];
    const whereCondition = getWhereConditionFunction(getPayload, allColumns);
    const [totalCount, data] = await Promise.all([
      JournalingData.getJournalTotalForUser(userId, whereCondition),
      JournalingData.getJournalForUser(userId, whereCondition, getPayload),
    ]);
    return { totalCount, data };
  }
  const [totalCount, data] = await Promise.all([
    JournalingData.getJournalTotalForUserWithoutCondition(userId),
    JournalingData.getJournalForUserWithoutCondition(userId),
  ]);
  return { totalCount, data };
};

const getDetailJournal = (userId: string, journalId: string) =>
  JournalingData.getJournalDetailForUser(userId, journalId);

const JournalingService = {
  createJournal,
  getJournals,
  getDetailJournal,
};

export default JournalingService;
