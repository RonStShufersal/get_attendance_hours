import { Day, ValidDay, ValidHour, ValidMinute, ValidMonth } from '../types/hours';

export function getDayFromDayType(day: Day): ValidDay {
  return Number(day.dayValue.split('/')[0]) as ValidDay;
}

export function getMonthFromDayType(day: Day): ValidMonth {
  return Number(day.dayValue.split('/')[1]) as ValidMonth;
}
  //@ts-ignore
export function getHourFromHours(hourValue: Day['hours']['in'] | Day['hours']['out']): ValidHour {
  return Number(hourValue.split(':')[0]) as ValidHour;
}
  //@ts-ignore
export function getMinutesFromHours(hourValue: Day['hours']['in'] | Day['hours']['out']): ValidMinute {
  return Number(hourValue.split(':')[1]) as ValidMinute;
}
