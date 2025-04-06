import { DayValue } from '../types/hours';

export function dateFormat(date?: Date | number): DayValue {
	return new Intl.DateTimeFormat('fr', {
		day: '2-digit',
		month: '2-digit',
	}).format(date) as DayValue;
}
