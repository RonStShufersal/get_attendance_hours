import { DayValue, Hour } from '../../types/hours';

export interface RawDayRow {
	day?: DayValue;
	hours: Hour[];
	selectElementTitle?: string;
}

export interface RawDayRowWithDayModifier {
	day?: DayValue;
	hours: Hour[];
	isVacation: boolean;
	isSickDay: boolean;
}

export enum DayModifiers {
	SICK_DAY,
	VACATION,
}
