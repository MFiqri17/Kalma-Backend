import { z } from 'zod';
import { validateSQLInjection } from './user.schema';

const requiredMessage = 'VALIDATION.REQUIREDMESSAGE';
const musicCantBeBothMessage = 'VALIDATION.MUSICRESOURCECANTBEBOTH';
const sqlInjectionMessage = 'VALIDATION.SQLINJECTION';
const invalidAudioFormat = 'VALIDATION.INVALIDAUDIOFORMAT';
const invalidImageFileFormat = 'VALIDATION.INVALIDIMAGEFILE';

const getFileFormatUsingSplit = (url: string): string => {
  const parts = url.split('.');
  return parts[parts.length - 1];
};

const supportedMusicFormat = ['mp3', 'mpeg'];
const supportedImageFormat = ['png', 'jpeg', 'jpg'];

export const createMusicSchema = z
  .object({
    title: z
      .string({ required_error: requiredMessage })
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage }),
    author: z.string().trim().refine(validateSQLInjection, { message: sqlInjectionMessage }).nullable(),
    genre: z
      .string({ required_error: requiredMessage })
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage }),
    music_image: z
      .string()
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage })
      .refine(
        (value) => value && supportedImageFormat.includes(getFileFormatUsingSplit(value)),
        invalidImageFileFormat,
      ),
    music_link: z
      .string()
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage })
      .refine((value) => value && supportedMusicFormat.includes(getFileFormatUsingSplit(value)), invalidAudioFormat)
      .optional(),
    music_file: z
      .custom<Express.Multer.File>((val) => typeof val !== 'string' && val !== '', invalidAudioFormat)
      .refine((file) => file && supportedMusicFormat.includes(file.mimetype), invalidAudioFormat)
      .optional(),
  })
  .refine((data) => data.music_link || data.music_file, {
    message: requiredMessage,
    path: ['music'],
  })
  .refine((data) => !(data.music_link && data.music_file), {
    message: musicCantBeBothMessage,
    path: ['music'],
  });

export const updateMusicSchema = z
  .object({
    title: z
      .string({ required_error: requiredMessage })
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage }),
    author: z.string().trim().refine(validateSQLInjection, { message: sqlInjectionMessage }).nullable(),
    genre: z
      .string({ required_error: requiredMessage })
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage }),
    music_image: z
      .string()
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage })
      .refine(
        (value) => value && supportedImageFormat.includes(getFileFormatUsingSplit(value)),
        invalidImageFileFormat,
      ),
    music_link: z
      .string()
      .min(1, { message: requiredMessage })
      .trim()
      .refine(validateSQLInjection, { message: sqlInjectionMessage })
      .refine((value) => value && supportedMusicFormat.includes(getFileFormatUsingSplit(value)), invalidAudioFormat)
      .optional(),
    music_file: z
      .custom<Express.Multer.File>((val) => typeof val !== 'string' && val !== '', invalidAudioFormat)
      .refine((file) => file && supportedMusicFormat.includes(file.mimetype), invalidAudioFormat)
      .optional(),
  })
  .refine((data) => !(data.music_link && data.music_file), {
    message: musicCantBeBothMessage,
    path: ['music'],
  });
