import { z } from 'zod';
import { validateSQLInjection } from './user.schema';

const requiredMessage = 'VALIDATION.REQUIREDMESSAGE';
const sqlInjectionMessage = 'VALIDATION.SQLINJECTION';
const emotionEnums = ['sad', 'angry', 'glad', 'elated'];

const validateEmotion = (value: string) => {
  return emotionEnums.includes(value);
};

export const createJournal = z.object({
  title: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  emotion: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateEmotion, {
      message: 'Emotion value does not exist.',
    })
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  content: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
});
