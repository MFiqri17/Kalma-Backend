import { z } from 'zod';
import { validateSQLInjection } from './user.schema';

const requiredMessage = 'VALIDATION.REQUIREDMESSAGE';
const sqlInjectionMessage = 'VALIDATION.SQLINJECTION';

export const createMusic = z.object({
  title: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  author: z.string().trim().refine(validateSQLInjection, { message: sqlInjectionMessage }).nullable().optional(),
});
