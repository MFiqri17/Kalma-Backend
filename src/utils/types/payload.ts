import {
  createUserSchema,
  authenticateUserSchema,
  updateUserSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  getRefreshTokenSchema,
} from '../schema/user.schema';
import { selfScreeningTestSchema } from '../schema/selfScreening.schema';
import { createJournal } from '../schema/journaling.schema';
import { z } from 'zod';
import { createMusicSchema, updateMusicSchema } from '../schema/music.schema';
import { createArticle, updateArticle } from '../schema/article.schema';

export type createUserPayload = z.infer<typeof createUserSchema>;
export type getRefreshTokenPayload = z.infer<typeof getRefreshTokenSchema>;
export type authenticateUserPayload = z.infer<typeof authenticateUserSchema>;
export type updateUserPayload = z.infer<typeof updateUserSchema>;
export type selfScreeningPayload = z.infer<typeof selfScreeningTestSchema>;
export type forgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type resetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type createJournalPayload = z.infer<typeof createJournal>;
export type createMusicPayload = z.infer<typeof createMusicSchema>;
export type updateMusicPayload = z.infer<typeof updateMusicSchema>;
export type createArticlePayload = z.infer<typeof createArticle>;
export type updateArticlePayload = z.infer<typeof updateArticle>;
export type getQueryPayload = {
  size: number;
  page: number;
  sort_value: 'asc' | 'desc';
  sort_column: string;
  search_value: string;
  search_column: string;
  filter_value: string;
  filter_column: string;
};
