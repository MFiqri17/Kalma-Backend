import moment from 'moment';
import { getQueryPayload } from '../types/payload';
import REGEX from '../constant/regex';
import { lowerCase } from 'text-case';

export const getArticleWhereConditionFunction = (getPayload: Partial<getQueryPayload>): object => {
  const { search_value, search_column } = getPayload;
  if (getPayload && search_value) {
    const arrayColumn = ['content', 'article_type'];
    if (search_column) {
      if (arrayColumn.includes(search_column))
        return {
          [search_column]: {
            has: lowerCase(search_value),
          },
        };
      else if (search_column === 'user')
        return {
          user: {
            full_name: {
              contains: lowerCase(search_value),
            },
          },
        };
      else
        return {
          [search_column]: {
            contains: lowerCase(search_value),
          },
        };
    }
    return {
      OR: [
        { title: { contains: lowerCase(search_value), mode: 'insensitive' } },
        {
          content: {
            has: lowerCase(search_value),
          },
        },
        {
          article_type: {
            has: lowerCase(search_value),
          },
        },
        {
          user: {
            full_name: {
              contains: lowerCase(search_value),
              mode: 'insensitive',
            },
          },
        },
        {
          created_at_formatted: {
            contains: lowerCase(search_value),
            mode: 'insensitive',
          },
        },
        {
          modified_at_formatted: {
            contains: lowerCase(search_value),
            mode: 'insensitive',
          },
        },
      ],
    };
  }
  return {};
};

export const getWhereConditionFunction = (getPayload: Partial<getQueryPayload>, allColumns?: string[]): object => {
  const { search_value, search_column, filter_column, filter_value } = getPayload;
  let whereCondition = {};
  if ((search_value && search_column) || (filter_column && filter_value)) {
    const column = search_value && search_column ? search_column : filter_column || '';
    const value = search_value && search_column ? search_value : filter_value;
    const method = search_value && search_column ? 'contains' : 'equals';
    const dateColumn = ['created_at_formatted', 'modified_at_formatted', 'last_logged_in_formatted'];
    if (dateColumn.includes(column)) {
      whereCondition = {
        [column]: { contains: value, mode: 'insensitive' },
      };
    } else if (isNaN(parseFloat(value!))) {
      whereCondition = {
        [column]: { [method]: value },
      };
    } else {
      whereCondition = {
        [column]: { equals: parseFloat(value!) },
      };
    }
  } else if (search_value && allColumns) {
    const parsedValue = search_value && parsedValueExceptYearFunction(search_value);
    if (isIntegerExceptYearValue(search_value)) {
      whereCondition = {
        OR: allColumns.map((col) => ({ [col]: { equals: parsedValue } })),
      };
    } else {
      whereCondition = {
        OR: allColumns.map((col) => ({ [col]: { contains: parsedValue, mode: 'insensitive' } })),
      };
    }
  } else {
    whereCondition = {};
  }
  return whereCondition;
};

export const parsedValueExceptYearFunction = (value: string): number | string => {
  const parsedNumber = parseFloat(value);
  if (!isNaN(parsedNumber) && !REGEX.YEAR_FORMAT.test(value)) {
    return parsedNumber;
  } else {
    return value;
  }
};

export const isIntegerExceptYearValue = (value: string): boolean => {
  const parsedNumber = parseFloat(value);
  if (!isNaN(parsedNumber) && !REGEX.YEAR_FORMAT.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const getFormatDate = (formatType?: string, dateTime?: string) => moment(dateTime).utc(true).format(formatType);
