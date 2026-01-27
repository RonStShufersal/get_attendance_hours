import { DayType, GroupedDays } from '../clients/types/CommonTypes';
import { Day } from '../clients/types/HourDay';

export function day2GroupedDays(days: Day[]): GroupedDays {
	const record: GroupedDays = {
		[DayType.REGULAR]: [],
		[DayType.SICK_DAY]: [],
		[DayType.VACATION]: [],
	};

	for (const day of days) {
		record[day.dayType].push(day);
	}

	return record;
}
