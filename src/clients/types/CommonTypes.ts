import { DayValue, Hour } from './HourDay';

export interface RawDayRow {
	day?: DayValue;
	hours: Hour[];
	selectElementTitle?: string;
}

export enum DayType {
	SICK_DAY = 'sickDay',
	VACATION = 'vacation',
	REGULAR = 'regular',
}
