import { z } from 'zod';
import { validateSQLInjection } from './user.schema';

const requiredMessage = 'VALIDATION.REQUIREDMESSAGE';
const sqlInjectionMessage = 'VALIDATION.SQLINJECTION';
const invalidImageFileFormat = 'VALIDATION.INVALIDIMAGEFILE';
const arrayCantbeEmpty = 'VALIDATION.ARRAYCANTBEEMPTY';

export const createArticle = z.object({
  title: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  image: z
    .custom<Express.Multer.File>((val) => typeof val !== 'string' && val !== '', invalidImageFileFormat)
    .refine((file) => file && file.mimetype.startsWith('image/'), invalidImageFileFormat)
    .optional(),
  article_type: z.string().array().min(1, {
    message: arrayCantbeEmpty,
  }),
  content: z.string().array().min(1, {
    message: arrayCantbeEmpty,
  }),
});

export const updateArticle = z.object({
  title: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  image: z
    .custom<Express.Multer.File>((val) => typeof val !== 'string' && val !== '', invalidImageFileFormat)
    .refine((file) => file && file.mimetype.startsWith('image/'), invalidImageFileFormat)
    .optional(),
  article_type: z.string().array().min(1, {
    message: arrayCantbeEmpty,
  }),
  content: z.string().array().min(1, {
    message: arrayCantbeEmpty,
  }),
});
