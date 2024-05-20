const REGEX = {
  CONTAIN_SQL_CHARACTERS: /INSERT\s+INTO|UPDATE|DELETE|ALTER|DROP|CREATE|TRUNCATE/i,
  FIND_FIRST_LETTER_AFTER_PUNCTUATIONS: /(^|[.!?]\s*)([a-z])/g,
  CHECK_EMAIL_FORMAT: /\S+@\S+\.\S+/,
  YEAR_FORMAT: /^\d{4}$/,
  BOOLEAN_STRING_ONLY: /^(true|false)$/,
  NUMBER_STRING_ONLY: /^\d+$/,
  APLPHABET_STRING_ONLY: /^[a-zA-Z\s]+$/,
} as const;

export default REGEX;
