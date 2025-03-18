import { Day, ValidDay, ValidMonth } from '../types/hours';

export function getDayFromDayType(day: Day): ValidDay {
  return Number(day.dayValue.split('/')[0]) as ValidDay;
}

export function getMonthFromDayType(day: Day): ValidMonth {
  return Number(day.dayValue.split('/')[1]) as ValidMonth;
}
