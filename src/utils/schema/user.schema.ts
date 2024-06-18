import { z } from 'zod';
import REGEX from '../constant/regex';

const requiredMessage = 'VALIDATION.REQUIREDMESSAGE';
const invalidEmailFormat = 'VALIDATION.INVALIDEMAILFORMAT';
const sqlInjectionMessage = 'VALIDATION.SQLINJECTION';
const invalidImageFileFormat = 'VALIDATION.INVALIDIMAGEFILE';
const alphabetCharOnly = 'VALIDATION.ALPHABETCHARONLY';

export const validateSQLInjection = (val: string) => !REGEX.CONTAIN_SQL_CHARACTERS.test(val.toUpperCase());
export const validateAge = (val: string) => REGEX.NUMBER_STRING_ONLY.test(val) && val !== '';
export const validateUserPrivacy = (val: string) => REGEX.BOOLEAN_STRING_ONLY.test(val) && val !== '';
export const validateAlphabetCharOnly = (val: string) => REGEX.APLPHABET_STRING_ONLY.test(val);

export const createUserSchema = z.object({
  email: z
    .string({ required_error: requiredMessage })
    .email({ message: invalidEmailFormat })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  password: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  username: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  full_name: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage })
    .refine(validateAlphabetCharOnly, { message: alphabetCharOnly }),
  age: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateAge, { message: 'Expected string number, not string text' }),
  avatar: z
    .custom<Express.Multer.File>((val) => typeof val !== 'string' && val !== '', invalidImageFileFormat)
    .refine((file) => file && file.mimetype.startsWith('image/'), invalidImageFileFormat)
    .optional(),
});

export const authenticateUserSchema = z.object({
  email_or_username: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  password: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
});

export const getRefreshTokenSchema = z.object({
  refresh_token: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
});

export const updateUserSchema = z.object({
  email: z
    .string({ required_error: requiredMessage })
    .email({ message: invalidEmailFormat })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  username: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  full_name: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage })
    .refine(validateAlphabetCharOnly, { message: alphabetCharOnly }),
  age: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateAge, { message: 'Expected string number, not string text' }),
  avatar: z
    .custom<Express.Multer.File>((val) => typeof val !== 'string' && val !== '', invalidImageFileFormat)
    .refine((file) => file && file.mimetype.startsWith('image/'), invalidImageFileFormat)
    .optional(),
  allow_journal: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateUserPrivacy, { message: 'Expected string boolean, not string text' }),
});

export const forgotPasswordSchema = z.object({
  email_or_username: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
});

export const resetPasswordSchema = z.object({
  new_password: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
  new_password_confirmation: z
    .string({ required_error: requiredMessage })
    .min(1, { message: requiredMessage })
    .trim()
    .refine(validateSQLInjection, { message: sqlInjectionMessage }),
});
