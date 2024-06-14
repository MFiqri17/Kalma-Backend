import { USER_ROLE } from '@prisma/client';
import { createJournalPayload, selfScreeningPayload } from './payload';

export type User = {
  id: string;
  username: string;
  full_name: string;
  age: number;
  email: string;
  password: string;
  avatar_link?: string | null;
  role: USER_ROLE;
  allow_journal: boolean;
  is_verified: boolean;
  is_approved: boolean;
  last_logged_in: Date | null;
  last_logged_in_formatted: string | null;
  created_at: Date;
  created_at_formatted: string;
};

export type selfScreeningExtendedPayload = selfScreeningPayload & {
  depression_status: string;
  anxiety_status: string;
  stress_status: string;
};

export type SelfScreeningData = selfScreeningExtendedPayload & {
  id: string;
  created_at_formatted: string;
  created_by: string;
};

export type Music = {
  id: string;
  title: string;
  author: string | null;
  genre: string;
  music_link: string;
  user?: Pick<User, 'full_name'> | null;
  modifiedUser?: Pick<User, 'full_name'> | null;
  created_at_formatted: string;
  modified_at_formatted: string;
};

export type Article = {
  id: string;
  title: string;
  image: string | null;
  content: string[];
  article_type: string[];
  user?: Pick<User, 'full_name'> | null;
  modifiedUser?: Pick<User, 'full_name'> | null;
  created_at_formatted: string;
  modified_at_formatted: string;
};

export type SelfScreeningHistoryParams = {
  data: SelfScreeningData[];
  totalCount: number;
};

export type JournalData = createJournalPayload & {
  id: string;
  created_at_formatted: string;
  created_by: string;
};

export type JournalHistoryParams = {
  data: JournalData[];
  totalCount: number;
};

export type MusicAllData = {
  data: Music[];
  totalCount: number;
};

export type GetPsychologParams = {
  data: User[];
  totalCount: number;
};

export type GetArticleParams = {
  data: Article[];
  totalCount: number;
};
