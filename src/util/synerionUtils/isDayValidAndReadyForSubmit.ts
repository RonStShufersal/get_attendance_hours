import { SynerionDayDTO } from '@/types/synerion';

export  default function isDayValidAndReadyForSubmit(synDay: SynerionDayDTO, todayDate: string): boolean {
	return Boolean(
		synDay.Date &&
			todayDate !== synDay.Date.slice(0, 10) &&
			synDay.InOuts[0]?.In.Time &&
			synDay.InOuts[0]?.Out.Time,
	);
}
