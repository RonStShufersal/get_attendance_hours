import { DayValue } from '../types/hours';

export function dateFormat(date?: Date | number): DayValue {
	return new Intl.DateTimeFormat('fr', {
		day: 'numeric',
		month: '2-digit',
	}).format(date).split('/').map(n => '' + +n).join('/') as DayValue;
}
