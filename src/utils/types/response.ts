export type TDefault = {
  is_success: boolean;
  message: string;
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
  user_privacy: boolean;
  last_logged_in: string | null;
};

export type TUpdateUserData = {
  username: string;
  full_name: string;
  email: string;
  age: number;
  avatar_link: string | null;
  user_privacy: boolean;
};

export type TTokenUserData = {
  access_token: string;
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

export type TUpdateUser = TDefault & {
  is_email_changed: boolean;
  data: TUpdateUserData;
};

export type TTokenUser = TDefault & TTokenUserData;

export type TPayloadValidation = TDefault & {
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

export type TCreateJournal = TDefault & {
  data: TJournalData;
};

export type TGetJournalHistory = TDefault &
  TGetResponseDefault & {
    data: TJournalData[];
  };

export type TGetJournalHistoryDetail = TDefault & {
  data: TJournalData;
};
