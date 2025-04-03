import { Day, Hour, ValidDay, ValidHour, ValidMinute, ValidMonth } from '../types/hours';

export function getDayFromDayType(day: Day): ValidDay {
	return Number(day.dayValue.split('/')[0]) as ValidDay;
}

export function getMonthFromDayType(day: Day): ValidMonth {
	return Number(day.dayValue.split('/')[1]) as ValidMonth;
}

export function getHourFromHours(hourValue: Hour): ValidHour {
	return Number(hourValue.split(':')[0]) as ValidHour;
}

export function getMinutesFromHours(hourValue: Hour): ValidMinute {
	return Number(hourValue.split(':')[1]) as ValidMinute;
}
