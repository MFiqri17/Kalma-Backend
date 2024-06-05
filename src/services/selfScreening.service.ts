import { getQueryPayload } from '../utils/types/payload';
import { selfScreeningExtendedPayload } from '../utils/types/types';
import SelfScreeningData from '../data/selfScrening.data';
import { getWhereConditionFunction, isIntegerExceptYearValue } from '../utils/functions/conditionFunctions';

const createSelfScreening = (screeningData: selfScreeningExtendedPayload, userId: string) =>
  SelfScreeningData.createSelfScreening(screeningData, userId);

const getSelfScreenings = async (userId: string, getPayload?: Partial<getQueryPayload>) => {
  if (getPayload) {
    const { search_value } = getPayload;
    const stringColumns = ['depression_status', 'anxiety_status', 'stress_status', 'created_at_formatted'];
    const integerColumns = ['depression_score', 'anxiety_score', 'stress_score'];
    const allColumns = isIntegerExceptYearValue(search_value!) ? integerColumns : stringColumns;
    const whereCondition = getWhereConditionFunction(getPayload, allColumns);
    const [totalCount, data] = await Promise.all([
      SelfScreeningData.getSelfCreeningTotalData(userId, whereCondition),
      SelfScreeningData.getSelfScreeningData(userId, whereCondition, getPayload),
    ]);
    return { totalCount, data };
  }
  const [totalCount, data] = await Promise.all([
    SelfScreeningData.getSelfScreeningTotalDataWithoutCondition(userId),
    SelfScreeningData.getSelfScreeningDataWithoutCondition(userId),
  ]);
  return { totalCount, data };
};

const getDetailSelfScreening = (userId: string, selfScreeningId: string) =>
  SelfScreeningData.getDetailSelfScreening(userId, selfScreeningId);

const SelfScreeningService = {
  createSelfScreening,
  getSelfScreenings,
  getDetailSelfScreening,
};

export default SelfScreeningService;
