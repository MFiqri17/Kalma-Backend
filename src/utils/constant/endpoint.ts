const ENDPOINTS = {
  GENERAL: '/api/user',
  SELF_SCREENING: '/api/self-screening',
  JOURNALING: '/api/self-management/journals',
  MUSICMEDITATION: '/api/self-management/music-meditation',
  LOGIN: '/authenticate',
  REGISTER: '/register',
  GET_USER_PROPERTY: '/user-property',
  UPDATE_USER_PROPERTY: '/user-property/update',
  REFRESH_TOKEN: '/refresh-token',
  SEND_VERIFICATION_EMAIL: '/send-email-verification',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASWORD: '/reset-password',
  CREATE_SELF_SCREENING: '/test',
  GET_SELF_SCREENING: '/history',
  USERS_JOURNAL: '/users-journal',
  JOURNALS_BY_USER: '/journals-by-user',
  CREATE_JOURNAL: '/create',
} as const;

export default ENDPOINTS;
