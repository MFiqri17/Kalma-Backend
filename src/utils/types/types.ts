import { USER_ROLE } from '@prisma/client';
import { selfScreeningFormatedPayload, createJournalPayload } from './payload';

export type User = {
  id: string;
  username: string;
  full_name: string;
  age: number;
  email: string;
  password: string;
  avatar_link?: string | null;
  role: USER_ROLE;
  user_privacy: boolean;
  is_verified: boolean;
  last_logged_in: Date | null;
  last_logged_in_formatted: string | null;
  created_at: Date;
  created_at_formatted: string;
};

export type SelfScreeningData = selfScreeningFormatedPayload & {
  id: string;
  created_at_formatted: string;
  created_by: string;
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
