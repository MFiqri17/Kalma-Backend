export type TDefault = {
  is_success: boolean;
  message: string;
};

export type TBadRequestErrorResponse = TDefault & {
  type: 'default' | 'email' | 'approve' | 'link';
};

export type TGetResponseDefault = {
  size: number;
  page: number;
  total_items: number;
  total_pages: number;
};

export type TCreateUserData = {
  email: string;
  username: string;
  full_name: string;
  age: number;
};

export type TGetUserData = {
  username: string;
  full_name: string;
  email: string;
  age: number;
  avatar_link: string | null;
  allow_journal: boolean;
  last_logged_in: string | null;
};

export type TGetPsychologData = {
  id: string;
  full_name: string;
  email: string;
  age: number;
  is_approved: boolean;
  last_logged_in: string | null;
  created_date: string;
};

export type TUpdateUserData = {
  username: string;
  full_name: string;
  email: string;
  age: number;
  avatar_link: string | null;
  allow_journal: boolean;
};

export type TTokenUserData = {
  access_token: string;
  refresh_token: string;
  is_email_verified: boolean;
};

export type TSelfScreeningData = {
  score: number;
  status: string;
};

export type TCreateUser = TDefault & {
  data: TCreateUserData;
};

export type TGetUser = TDefault & {
  data: TGetUserData;
};

export type TGetPsycholog = TDefault &
  TGetResponseDefault & {
    data: TGetPsychologData[];
  };

export type TUpdateUser = TDefault & {
  is_email_changed: boolean;
  data: TUpdateUserData;
};

export type TTokenUser = TDefault & TTokenUserData;

export type TPayloadValidation = TBadRequestErrorResponse & {
  error_details: { [key: string]: string };
};

export type TSelfScreeningItem = {
  depression_result: TSelfScreeningData;
  anxiety_result: TSelfScreeningData;
  stress_result: TSelfScreeningData;
};

export type TSelfScreeningTest = TDefault & {
  data: TSelfScreeningItem;
};

export type TSelfScreeningHistoryData = {
  id: string;
  created_date: string;
} & TSelfScreeningItem;

export type TSelfScreeningHistory = TGetResponseDefault & {
  data: TSelfScreeningHistoryData[];
} & TDefault;

export type TSelfScreeningHistoryDetail = TDefault & {
  data: TSelfScreeningHistoryData;
};

export type TJournalData = {
  id: string;
  title: string;
  emotion: string;
  content: string;
  created_date: string;
};

export type TMusicData = {
  id: string;
  title: string;
  author: string | null;
  genre: string;
  music_link: string;
  music_image: string;
  created_by?: string;
  created_date: string;
  updated_by?: string;
  updated_date: string;
};

export type TCreateJournal = TDefault & {
  data: TJournalData;
};

export type TGetJournalHistory = TDefault &
  TGetResponseDefault & {
    data: TJournalData[];
  };

export type TGetUserJournalForPsychologist = TDefault &
  TGetResponseDefault & {
    user_data: Partial<TGetUserData>;
    journal_data: TJournalData[];
  };

export type TGetJournalHistoryDetail = TDefault & {
  data: TJournalData;
};

export type TCreateMusic = TDefault & {
  data: TMusicData;
};

export type TGetMusic = TDefault &
  TGetResponseDefault & {
    data: TMusicData[];
  };

export type TGetMusicDetail = TDefault & {
  data: TMusicData;
};

export type TUpdateMusic = TDefault & {
  data: TMusicData;
};

export type TArticleData = {
  id: string;
  title: string;
  image: string | null;
  content: string[];
  article_type: string[];
  created_by?: string;
  created_date: string;
  updated_by?: string;
  updated_date: string;
};

export type TCreateArticle = TDefault & {
  data: TArticleData;
};

export type TUpdateArticle = TDefault & {
  data: TArticleData;
};

export type TGetArticle = TDefault &
  TGetResponseDefault & {
    data: TArticleData[];
  };

export type TGetDetailArticle = TDefault & {
  data: TArticleData;
};
