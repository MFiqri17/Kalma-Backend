import { CookieOptions } from 'express';
import {
  TTokenUser,
  TCreateUser,
  TDefault,
  TGetUser,
  TUpdateUser,
  TPayloadValidation,
  TSelfScreeningTest,
  TSelfScreeningHistory,
  TSelfScreeningHistoryDetail,
  TCreateJournal,
  TGetJournalHistory,
  TGetJournalHistoryDetail,
  TJournalData,
} from '../types/response';
import { User, SelfScreeningData, SelfScreeningHistoryParams, JournalData, JournalHistoryParams } from '../types/types';
import { capitalizeFirstLetter } from './formatTextFunction';
import { isSevere, selfScreeningGetterFunction } from './selfScreeningFunction';
import { t } from 'i18next';
import DASS_SCORE from '../constant/variable';
import { ZodError } from 'zod';
import { capitalCase, sentenceCase, upperCase } from 'text-case';
import { getQueryPayload } from '../types/payload';

export const defaultResponse = (
  is_success: boolean,
  message: string,
  field?: string,
  fieldValue?: string,
): TDefault => ({
  is_success: is_success,
  message: capitalizeFirstLetter(t(message, { [field!]: fieldValue })),
});

export const serverErrorResponse = () => defaultResponse(false, 'ERRORRESPONSE.INTERNALSERVERERROR');
export const idNotFoundResponse = (id: string) => defaultResponse(false, 'ERRORRESPONSE.NOTFOUND', 'ID', id);
export const invalidCredentialResponse = () => defaultResponse(false, 'VALIDATION.WRONGCREDENTIALS');
export const invalidAccessTokenResponse = () => defaultResponse(false, 'VALIDATION.INVALIDACCESSTOKEN');
export const invalidRefreshTokenResponse = () => defaultResponse(false, 'VALIDATION.INVALIDREFRESHTOKEN');
export const invalidLinkTokenResponse = () => defaultResponse(false, 'VALIDATION.LINKTOKENINVALID');
export const emailIsVerifiedResponse = () => defaultResponse(false, 'VALIDATION.EMAILISVERIFIED');
export const emailIsNotVerifiedResponse = () => defaultResponse(false, 'VALIDATION.EMAILISNOTVERIFIED');
export const existedUserResponse = () => defaultResponse(false, 'VALIDATION.EXISTEDUSER');
export const passwordDoNotMatch = () => defaultResponse(false, 'VALIDATION.PASSWORDSDONOTMATCH');

export const sendEmaiResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.SENDEMAILVERIFICATION');
export const verifyEmailResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.VERIFYEMAIL');
export const forgotPasswordResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.FORGOTPASSWORD');
export const resetPasswordResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.RESETPASSWORD');

export const createUserResponse = (userData: User): TCreateUser => {
  const newUserData = {
    email: userData.email,
    username: userData.username,
    full_name: capitalCase(userData.full_name),
    age: userData.age,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.CREATEUSER'),
    data: newUserData,
  };
};

export const getUserResponse = (userData: User): TGetUser => {
  const getUserData = {
    username: userData.username,
    full_name: capitalCase(userData.full_name),
    email: userData.email,
    age: userData.age,
    avatar_link: userData.avatar_link!,
    user_privacy: userData.user_privacy,
    last_logged_in: userData.last_logged_in_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETUSERPROTOTYPE'),
    data: getUserData,
  };
};

export const updateUserResponse = (userData: User, isEmailChanged: boolean): TUpdateUser => {
  const updatedUserData = {
    username: userData.username,
    full_name: capitalCase(userData.full_name),
    email: userData.email,
    age: userData.age,
    avatar_link: userData.avatar_link!,
    user_privacy: userData.user_privacy,
  };
  const message = isEmailChanged ? 'SUCCESSRESPONSE.UPDATEUSERANDEMAIL' : 'SUCCESSRESPONSE.UPDATEUSER';
  return {
    ...defaultResponse(true, message),
    is_email_changed: isEmailChanged,
    data: updatedUserData,
  };
};

export const tokenUserResponse = (accessToken: string, isVerified: boolean, isAccessToken: boolean): TTokenUser => {
  const accessTokenMessage = isVerified
    ? 'SUCCESSRESPONSE.VERIFIEDAUTHENTICATEUSER'
    : 'SUCCESSRESPONSE.UNVERIFIEDAUTHENTICATEUSER';
  const refreshTokenMessage = 'SUCCESSRESPONSE.REFRESHTOKEN';
  const message = isAccessToken ? accessTokenMessage : refreshTokenMessage;
  return {
    ...defaultResponse(true, message),
    access_token: accessToken,
    is_email_verified: isVerified,
  };
};

export const refreshTokenConfigResponse = (): CookieOptions => ({
  httpOnly: true,
  // secure: true,
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000,
});

export const payloadValidationResponse = (error: ZodError): TPayloadValidation => {
  const formattedErrors: { [key: string]: string } = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    const upperCasePath = upperCase(path);
    const translationKey = `VARIABLE.${upperCasePath}`;
    formattedErrors[path] = sentenceCase(t(err.message, { FIELD: t(translationKey) }));
  });
  return {
    ...defaultResponse(false, 'ERRORRESPONSE.BADREQUEST'),
    error_details: formattedErrors,
  };
};

export const selfScreeningTestResponse = (selfScreeningData: SelfScreeningData): TSelfScreeningTest => {
  const { depression_score, anxiety_score, stress_score } = selfScreeningData;

  const message =
    isSevere(depression_score, DASS_SCORE.DEPRESSION.SEVERE.MIN) ||
    isSevere(anxiety_score, DASS_SCORE.ANXIETY.SEVERE.MIN) ||
    isSevere(stress_score, DASS_SCORE.STRESS.SEVERE.MIN)
      ? t('SUCCESSRESPONSE.SELFSCREENINGTEST.SEVERERESULTMESSAGE')
      : t('SUCCESSRESPONSE.SELFSCREENINGTEST.NORMALRESULTMESSAGE');

  return {
    ...defaultResponse(true, message),
    data: selfScreeningGetterFunction(selfScreeningData),
  };
};

export const selfScreeningHistoryResponse = (
  selfScreeningData: SelfScreeningHistoryParams,
  getQueryPayload: Partial<getQueryPayload>,
): TSelfScreeningHistory => {
  const { page } = getQueryPayload;
  const data = selfScreeningData.data.map((screeningData) => ({
    id: screeningData.id,
    created_date: screeningData.created_at_formatted,
    ...selfScreeningGetterFunction(screeningData),
  }));
  const totalItems = selfScreeningData.totalCount;
  const sizeData = data.length;
  const totalPages = totalItems > 0 && sizeData > 0 ? Math.ceil(totalItems / sizeData) : 0;
  const getResponseProps = {
    size: sizeData,
    page: page ?? 1,
    total_items: totalItems,
    total_pages: totalPages,
  };
  const message = sizeData < 1 || totalItems < 1 ? 'VALIDATION.EMPTYDATA' : 'SUCCESSRESPONSE.GETSELFSCREENINGDATA';
  return {
    ...defaultResponse(true, message),
    ...getResponseProps,
    data,
  };
};

export const selfScreeningHistoryDetailResponse = (
  selfScreeningData: SelfScreeningData,
): TSelfScreeningHistoryDetail => {
  const data = {
    id: selfScreeningData.id,
    created_date: selfScreeningData.created_at_formatted,
    ...selfScreeningGetterFunction(selfScreeningData),
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETSELFSCREENINGDETAILDATA', 'ID', data.id),
    data,
  };
};

export const createJournalResponse = (journalData: JournalData): TCreateJournal => {
  const data = {
    id: journalData.id,
    title: journalData.title,
    emotion: journalData.emotion,
    content: journalData.content,
    created_date: journalData.created_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.CREATEJOURNAL'),
    data,
  };
};

export const getJournalResponse = (
  journalData: JournalHistoryParams,
  getQueryPayload: Partial<getQueryPayload>,
): TGetJournalHistory => {
  const { page } = getQueryPayload;
  const data: TJournalData[] = journalData.data.map((journal) => ({
    ...journal,
    created_date: journal.created_at_formatted,
  }));
  const totalItems = journalData.totalCount;
  const sizeData = data.length;
  const totalPages = totalItems > 0 && sizeData > 0 ? Math.ceil(totalItems / sizeData) : 0;
  const getResponseProps = {
    size: sizeData,
    page: page ?? 1,
    total_items: totalItems,
    total_pages: totalPages,
  };
  return {
    ...getResponseProps,
    data,
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETJOURNALHISTORY'),
  };
};

export const getJournalDetailResponse = (journalData: JournalData): TGetJournalHistoryDetail => {
  const data = {
    created_date: journalData.created_at_formatted,
    ...journalData,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETJOURNALDETAILHISTORY', 'ID', data.id),
    data,
  };
};

export const handleErrorEmptyDataResponse = (getQueryPayload: Partial<getQueryPayload>): TSelfScreeningHistory => ({
  page: getQueryPayload.page ?? 1,
  size: 0,
  total_items: 0,
  total_pages: 0,
  data: [],
  ...defaultResponse(true, 'VALIDATION.EMPTYDATA'),
});
