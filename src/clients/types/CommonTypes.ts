import { Day, DayValue, Hour } from './HourDay';

export interface RawDayRow {
	day?: DayValue;
	hours: Hour[];
}

export enum DayType {
	SICK_DAY = 'sickDay',
	VACATION = 'vacation',
	REGULAR = 'regular',
}

export type GroupedDays = Record<DayType, Day[]>;
