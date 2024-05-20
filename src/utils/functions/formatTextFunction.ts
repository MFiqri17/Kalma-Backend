import REGEX from '../constant/regex';

export const capitalizeFirstLetter = (text: string): string =>
  text
    .toLowerCase()
    .replace(
      REGEX.FIND_FIRST_LETTER_AFTER_PUNCTUATIONS,
      (match, separator, char: string) => separator + char.toUpperCase(),
    );
