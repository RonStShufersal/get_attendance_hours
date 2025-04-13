import { Hour } from '@/types/hours';

export function stringIsHourBase(s: string): s is Hour {
	const split = s?.split(':').length;
	return split === 2 || split === 3;
}
