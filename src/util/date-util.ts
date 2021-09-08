import { getDayStart } from '@wojtekmaj/date-utils';
import dateFormat from 'dateformat';

const TWO_WEEKS_IN_MILLIS = 1209600000;

const format = (date: Date | string | number, mask: string, utc: boolean = true, gmt: boolean = false) =>
  dateFormat(date, mask, utc, gmt);

export const toDateTime = (date: string): string => (date ? format(date, 'mm/dd/yy h:MM TT', false) : '');

export const toDayOfMonth = (date: string): string => (date ? format(date, 'd') : '');

export const toShortDate = (date: string): string => (date ? format(date, 'mm/dd/yy') : '');

export const toMediumDate = (date: string): string => (date ? format(date, 'mmm d, yyyy') : '');

export const toLocaleDateString = (date: Date | string | number): string =>
  date ? format(date, 'mm/dd/yyyy', false) : '';

export const toDayMonth = (date: Date = new Date()): string => format(date, 'mmm d', false);

export const toMonthYear = (date: Date = new Date()): string => format(date, 'mmmm yyyy', false);

export const toYear = (date: Date = new Date()): string => format(date, 'yyyy', false);

export const toUTC = (date: Date): Date => {
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date;
};

export const padDate = (day: number): string => String(day).padStart(2, '0');

export const determinePayPeriods = (): string[] => {
  let currentPeriodStart = new Date('2021-04-04T00:00').getTime();
  let currentPeriodEnd = new Date('2021-04-17T00:00').getTime();

  const payPeriods: string[] = [];
  while (
    currentPeriodStart < getDayStart(new Date()).getTime() &&
    currentPeriodStart < new Date('2021-12-01').getTime()
  ) {
    payPeriods.unshift(`${toLocaleDateString(currentPeriodStart)} - ${toLocaleDateString(currentPeriodEnd)}`);
    currentPeriodStart += TWO_WEEKS_IN_MILLIS;
    currentPeriodEnd += TWO_WEEKS_IN_MILLIS;
  }

  return payPeriods;
};
