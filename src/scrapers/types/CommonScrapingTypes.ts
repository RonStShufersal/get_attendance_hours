import { DayValue, Hour } from '../../types/hours';

export interface RawDayRow {
	day?: DayValue;
	hours: Hour[];
	selectElementTitle?: string;
}

export enum DayModifiers {
	SICK_DAY = 'sickDay',
	VACATION = 'vacation',
}
