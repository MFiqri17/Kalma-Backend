import DASS_SCORE from '../constant/variable';
import { t } from 'i18next';
import { constantCase, lowerCase } from 'text-case';
import { selfScreeningFormatedPayload, selfScreeningPayload } from '../types/payload';
import { TSelfScreeningItem } from '../types/response';

type ScoreRange = {
  min: number;
  max: number;
};

const inBetween = (value: number, min: number, max: number) => value >= min && value <= max;
const getStatus = (score: number, ranges: { [key: string]: ScoreRange }): string => {
  for (const status in ranges) {
    if (inBetween(score, ranges[status].min, ranges[status].max)) {
      return lowerCase(status);
    }
  }
  return '';
};
export const isSevere = (score: number, minValue: number) => score >= minValue;
export const depressionScoreFunction = (depression_score: number) => {
  const depressionRanges: { [key: string]: ScoreRange } = {
    NORMAL: { min: DASS_SCORE.DEPRESSION.NORMAL.MIN, max: DASS_SCORE.DEPRESSION.NORMAL.MAX },
    MILD: { min: DASS_SCORE.DEPRESSION.MILD.MIN, max: DASS_SCORE.DEPRESSION.MILD.MAX },
    MODERATE: { min: DASS_SCORE.DEPRESSION.MODERATE.MIN, max: DASS_SCORE.DEPRESSION.MODERATE.MAX },
    SEVERE: { min: DASS_SCORE.DEPRESSION.SEVERE.MIN, max: DASS_SCORE.DEPRESSION.SEVERE.MAX },
    'EXTREMELY SEVERE': {
      min: DASS_SCORE.DEPRESSION.EXTREMELY_SEVERE.MIN,
      max: DASS_SCORE.DEPRESSION.EXTREMELY_SEVERE.MAX,
    },
  };
  return { depression_score, depression_status: getStatus(depression_score, depressionRanges) };
};

export const anxietyScoreFunction = (anxiety_score: number) => {
  const anxietyRanges: { [key: string]: ScoreRange } = {
    NORMAL: { min: DASS_SCORE.ANXIETY.NORMAL.MIN, max: DASS_SCORE.ANXIETY.NORMAL.MAX },
    MILD: { min: DASS_SCORE.ANXIETY.MILD.MIN, max: DASS_SCORE.ANXIETY.MILD.MAX },
    MODERATE: { min: DASS_SCORE.ANXIETY.MODERATE.MIN, max: DASS_SCORE.ANXIETY.MODERATE.MAX },
    SEVERE: { min: DASS_SCORE.ANXIETY.SEVERE.MIN, max: DASS_SCORE.ANXIETY.SEVERE.MAX },
    'EXTREMELY SEVERE': {
      min: DASS_SCORE.ANXIETY.EXTREMELY_SEVERE.MIN,
      max: DASS_SCORE.ANXIETY.EXTREMELY_SEVERE.MAX,
    },
  };
  return { anxiety_score, anxiety_status: getStatus(anxiety_score, anxietyRanges) };
};

export const stressScoreFunction = (stress_score: number) => {
  const anxietyRanges: { [key: string]: ScoreRange } = {
    NORMAL: { min: DASS_SCORE.STRESS.NORMAL.MIN, max: DASS_SCORE.STRESS.NORMAL.MAX },
    MILD: { min: DASS_SCORE.STRESS.MILD.MIN, max: DASS_SCORE.STRESS.MILD.MAX },
    MODERATE: { min: DASS_SCORE.STRESS.MODERATE.MIN, max: DASS_SCORE.STRESS.MODERATE.MAX },
    SEVERE: { min: DASS_SCORE.STRESS.SEVERE.MIN, max: DASS_SCORE.STRESS.SEVERE.MAX },
    'EXTREMELY SEVERE': {
      min: DASS_SCORE.STRESS.EXTREMELY_SEVERE.MIN,
      max: DASS_SCORE.STRESS.EXTREMELY_SEVERE.MAX,
    },
  };
  return { stress_score, stress_status: getStatus(stress_score, anxietyRanges) };
};

export const selfScreeningSetterFunction = (
  selfScreeningPayload: selfScreeningPayload,
): selfScreeningFormatedPayload => {
  const { depression_score, anxiety_score, stress_score } = selfScreeningPayload;
  const data = {
    ...depressionScoreFunction(depression_score),
    ...anxietyScoreFunction(anxiety_score),
    ...stressScoreFunction(stress_score),
  };
  return data;
};

export const selfScreeningGetterFunction = (selfScreeningPayload: selfScreeningFormatedPayload): TSelfScreeningItem => {
  const { depression_score, anxiety_score, stress_score, depression_status, anxiety_status, stress_status } =
    selfScreeningPayload;
  const data = {
    depression_result: {
      score: depression_score,
      status: lowerCase(t(`VARIABLE.${constantCase(depression_status)}`)),
    },
    anxiety_result: {
      score: anxiety_score,
      status: lowerCase(t(`VARIABLE.${constantCase(anxiety_status)}`)),
    },
    stress_result: {
      score: stress_score,
      status: lowerCase(t(`VARIABLE.${constantCase(stress_status)}`)),
    },
  };
  return data;
};
