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
  TCreateMusic,
  TGetMusic,
  TGetMusicDetail,
  TUpdateMusic,
  TGetUserJournalForPsychologist,
  TGetPsycholog,
  TCreateArticle,
  TGetArticle,
  TGetDetailArticle,
  TUpdateArticle,
  TBadRequestErrorResponse,
} from '../types/response';
import {
  User,
  SelfScreeningData,
  SelfScreeningHistoryParams,
  JournalData,
  JournalHistoryParams,
  Music,
  MusicAllData,
  GetPsychologParams,
  GetArticleParams,
  Article,
} from '../types/types';
import { capitalizeFirstLetter } from './formatTextFunction';
import { isSevere, selfScreeningGetterFunction } from './selfScreeningFunction';
import { t } from 'i18next';
import DASS_SCORE from '../constant/variable';
import { ZodError } from 'zod';
import { capitalCase, sentenceCase, titleCase, upperCase } from 'text-case';
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

//500
export const serverErrorResponse = () => defaultResponse(false, 'ERRORRESPONSE.INTERNALSERVERERROR');

//404
export const idNotFoundResponse = (id: string) => defaultResponse(false, 'ERRORRESPONSE.IDNOTFOUND', 'ID', id);

//401
export const invalidAccessTokenResponse = () => defaultResponse(false, 'VALIDATION.INVALIDACCESSTOKEN');
export const invalidRefreshTokenResponse = () => defaultResponse(false, 'VALIDATION.INVALIDREFRESHTOKEN');

//403
export const forbiddenAccessResponse = () => defaultResponse(false, 'ERRORRESPONSE.FORBIDDENACCESS');

//400
export const emailIsNotVerifiedResponse = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.EMAILISNOTVERIFIED'),
  type: 'email',
});

export const accountIsNotApprovedResponse = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.USERISNOTAPPROVED'),
  type: 'approve',
});

export const invalidCredentialResponse = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.WRONGCREDENTIALS'),
  type: 'default',
});

export const invalidLinkTokenResponse = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.LINKTOKENINVALID'),
  type: 'link',
});

export const emailIsVerifiedResponse = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.EMAILISVERIFIED'),
  type: 'default',
});

export const existedUserResponse = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.EXISTEDUSER'),
  type: 'default',
});
export const existedDataResponse = (title: string): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.EXISTEDDATA', 'FIELD', title),
  type: 'default',
});

export const passwordDoNotMatch = (): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.PASSWORDSDONOTMATCH'),
  type: 'default',
});

export const psychologAlreadyApprovedResponse = (name: string): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.PSCHOLOGALREADYAPPROVED', 'NAME', capitalCase(name)),
  type: 'default',
});

export const isNotAllowedSeenJournalResponse = (user: string): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'VALIDATION.USERNOTALLOWEDSEENJOURNAL', 'USER', user),
  type: 'default',
});

export const nameNotFoundResponse = (username_or_fullname: string): TBadRequestErrorResponse => ({
  ...defaultResponse(false, 'ERRORRESPONSE.NAMENOTFOUND', 'NAME', username_or_fullname),
  type: 'default',
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
    type: 'default',
    error_details: formattedErrors,
  };
};

// Success Response
export const sendEmaiResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.SENDEMAILVERIFICATION');
export const verifyEmailResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.VERIFYEMAIL');
export const forgotPasswordResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.FORGOTPASSWORD');
export const resetPasswordResponse = () => defaultResponse(true, 'SUCCESSRESPONSE.RESETPASSWORD');
export const getUserRoleResponse = (role: string) => defaultResponse(true, role);
export const deleteMusicResponse = (id: string) => defaultResponse(true, 'SUCCESSRESPONSE.DELETEMUSICDATA', 'ID', id);
export const deleteArticleResponse = (id: string) =>
  defaultResponse(true, 'SUCCESSRESPONSE.DELETEARTICLEDATA', 'ID', id);
export const approvePsychologResponse = (name: string) =>
  defaultResponse(true, 'SUCCESSRESPONSE.APPROVEPSYCHOLOG', 'NAME', capitalCase(name));
export const deletePsychologResponse = (name: string) =>
  defaultResponse(true, 'SUCCESSRESPONSE.DELETEMUSICDATA', 'ID', capitalCase(name));

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
    allow_journal: userData.allow_journal,
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
    allow_journal: userData.allow_journal,
  };
  const message = isEmailChanged ? 'SUCCESSRESPONSE.UPDATEUSERANDEMAIL' : 'SUCCESSRESPONSE.UPDATEUSER';
  return {
    ...defaultResponse(true, message),
    is_email_changed: isEmailChanged,
    data: updatedUserData,
  };
};

export const tokenUserResponse = (
  accessToken: string,
  refreshToken: string,
  isVerified: boolean,
  isAccessToken: boolean,
): TTokenUser => {
  const accessTokenMessage = isVerified
    ? 'SUCCESSRESPONSE.VERIFIEDAUTHENTICATEUSER'
    : 'SUCCESSRESPONSE.UNVERIFIEDAUTHENTICATEUSER';
  const refreshTokenMessage = 'SUCCESSRESPONSE.REFRESHTOKEN';
  const message = isAccessToken ? accessTokenMessage : refreshTokenMessage;
  return {
    ...defaultResponse(true, message),
    access_token: accessToken,
    refresh_token: refreshToken,
    is_email_verified: isVerified,
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
  const { page, size } = getQueryPayload;
  const data = selfScreeningData.data.map((screeningData) => ({
    id: screeningData.id,
    created_date: screeningData.created_at_formatted,
    ...selfScreeningGetterFunction(screeningData),
  }));
  const totalItems = selfScreeningData.totalCount;
  const sizeData = size ?? data.length;
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
  const { page, size } = getQueryPayload;
  const data: TJournalData[] = journalData.data.map((journal) => ({
    id: journal.id,
    title: journal.title,
    emotion: journal.emotion,
    content: journal.content,
    created_date: journal.created_at_formatted,
  }));
  const totalItems = journalData.totalCount;
  const sizeData = size ?? data.length;
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

export const getJournalResponseForPsychologist = (
  journalData: JournalHistoryParams,
  userData: Partial<User>,
  getQueryPayload: Partial<getQueryPayload>,
): TGetUserJournalForPsychologist => {
  const { page, size } = getQueryPayload;
  const journal: TJournalData[] = journalData.data.map((journal) => ({
    id: journal.id,
    title: journal.title,
    emotion: journal.emotion,
    content: journal.content,
    created_date: journal.created_at_formatted,
  }));
  const user = {
    username: userData.username,
    full_name: titleCase(userData.full_name as string),
    age: userData.age,
  };
  const totalItems = journalData.totalCount;
  const sizeData = size ?? journal.length;
  const totalPages = totalItems > 0 && sizeData > 0 ? Math.ceil(totalItems / sizeData) : 0;
  const getResponseProps = {
    size: sizeData,
    page: page ?? 1,
    total_items: totalItems,
    total_pages: totalPages,
  };
  return {
    ...getResponseProps,
    user_data: user,
    journal_data: journal,
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETJOURNALHISTORY'),
  };
};

export const getJournalDetailResponse = (journalData: JournalData): TGetJournalHistoryDetail => {
  const data = {
    id: journalData.id,
    title: journalData.title,
    emotion: journalData.emotion,
    content: journalData.content,
    created_date: journalData.created_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETJOURNALDETAILHISTORY', 'ID', data.id),
    data,
  };
};

export const createMusicResponse = (musicData: Music): TCreateMusic => {
  const data = {
    id: musicData.id,
    title: musicData.title,
    author: musicData.author,
    genre: musicData.genre,
    music_link: musicData.music_link,
    music_image: musicData.music_image,
    created_by: musicData.user?.full_name,
    created_date: musicData.created_at_formatted,
    updated_by: musicData.modifiedUser?.full_name,
    updated_date: musicData.modified_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.CREATEMUSIC'),
    data,
  };
};

export const getMusicResponse = (musicAllData: MusicAllData, getQueryPayload: Partial<getQueryPayload>): TGetMusic => {
  const { page, size } = getQueryPayload;
  const data = musicAllData.data.map((data) => ({
    id: data.id,
    title: data.title,
    author: data.author,
    genre: data.genre,
    music_link: data.music_link,
    music_image: data.music_image,
    created_by: data.user?.full_name,
    created_date: data.created_at_formatted,
    updated_by: data.modifiedUser?.full_name,
    updated_date: data.modified_at_formatted,
  }));
  const totalItems = musicAllData.totalCount;
  const sizeData = size ?? data.length;
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
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETMUSICDATA'),
  };
};

export const getDetailMusicResponse = (musicData: Music): TGetMusicDetail => {
  const data = {
    id: musicData.id,
    title: musicData.title,
    author: musicData.author,
    genre: musicData.genre,
    music_link: musicData.music_link,
    music_image: musicData.music_image,
    created_by: musicData.user?.full_name,
    created_date: musicData.created_at_formatted,
    updated_by: musicData.modifiedUser?.full_name,
    updated_date: musicData.modified_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETDETAILMUSICDATA', 'ID', data.id),
    data,
  };
};

export const updateMusicResponse = (musicData: Music): TUpdateMusic => {
  const data = {
    id: musicData.id,
    title: musicData.title,
    author: musicData.author,
    genre: musicData.genre,
    music_link: musicData.music_link,
    music_image: musicData.music_image,
    created_by: musicData.user?.full_name,
    created_date: musicData.created_at_formatted,
    updated_by: musicData.modifiedUser?.full_name,
    updated_date: musicData.modified_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.UPDATEMUSICDATA', 'ID', data.id),
    data,
  };
};

export const getPsychologResponse = (
  pschologData: GetPsychologParams,
  getQueryPayload: Partial<getQueryPayload>,
): TGetPsycholog => {
  const { page, size } = getQueryPayload;
  const data = pschologData.data.map((data) => ({
    id: data.id,
    full_name: capitalCase(data.full_name),
    email: data.email,
    age: data.age,
    is_approved: data.is_approved,
    last_logged_in: data.last_logged_in_formatted,
    created_date: data.created_at_formatted,
  }));
  const totalItems = pschologData.totalCount;
  const sizeData = size ?? data.length;
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
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETPSYCHOLOGDATA'),
  };
};

export const createArticleResponse = (articleData: Article): TCreateArticle => {
  const data = {
    id: articleData.id,
    title: articleData.title,
    image: articleData.image,
    content: articleData.content,
    article_type: articleData.article_type,
    created_by: articleData.user?.full_name,
    created_date: articleData.created_at_formatted,
    updated_by: articleData.modifiedUser?.full_name,
    updated_date: articleData.modified_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.CREATEARTICLE'),
    data,
  };
};

export const getArticleResponse = (
  articleDataParams: GetArticleParams,
  getQueryPayload: Partial<getQueryPayload>,
): TGetArticle => {
  const { page, size } = getQueryPayload;
  const data = articleDataParams.data.map((data) => ({
    id: data.id,
    title: data.title,
    image: data.image,
    content: data.content,
    article_type: data.article_type,
    created_by: data.user?.full_name,
    created_date: data.created_at_formatted,
    updated_by: data.modifiedUser?.full_name,
    updated_date: data.modified_at_formatted,
  }));
  const totalItems = articleDataParams.totalCount;
  const sizeData = size ?? data.length;
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
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETARTICLEDATA'),
  };
};

export const getArticleDetailResponse = (articleData: Article): TGetDetailArticle => {
  const data = {
    id: articleData.id,
    title: articleData.title,
    image: articleData.image,
    content: articleData.content,
    article_type: articleData.article_type,
    created_by: articleData.user?.full_name,
    created_date: articleData.created_at_formatted,
    updated_by: articleData.modifiedUser?.full_name,
    updated_date: articleData.modified_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.GETDETAILARTICLEDATA', 'ID', data.id),
    data,
  };
};

export const updateArticleResponse = (articleData: Article): TUpdateArticle => {
  const data = {
    id: articleData.id,
    title: articleData.title,
    image: articleData.image,
    content: articleData.content,
    article_type: articleData.article_type,
    created_by: articleData.user?.full_name,
    created_date: articleData.created_at_formatted,
    updated_by: articleData.modifiedUser?.full_name,
    updated_date: articleData.modified_at_formatted,
  };
  return {
    ...defaultResponse(true, 'SUCCESSRESPONSE.UPDATEARTICLEDATA', 'ID', data.id),
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
