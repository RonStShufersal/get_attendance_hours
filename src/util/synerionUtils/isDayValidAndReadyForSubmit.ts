import { SynerionDayDTO } from '@/types/synerion';
import parseInOutTimes from './parseInOutTimes';

export default function isDayValidAndReadyForSubmit(synDay: SynerionDayDTO, todayDate: string): boolean {
	if (!synDay.InOuts[0]?.In.Time || !synDay.InOuts[0]?.Out.Time) {
		console.log('no time');
		return false};
	const { in: InTime, out: OutTime } = parseInOutTimes(synDay.InOuts[0].In, synDay.InOuts[0].Out);
	const [inHour, inMinute, inSecs] = InTime.split(':').map(parseInt);
	const [outHour, outMinute, outSecs] = OutTime.split(':').map(parseInt);
	console.log({inHour, inMinute, outHour, outMinute, date:synDay.Date});

	// prettier-ignore
	return Boolean(
		synDay.Date && todayDate !== synDay.Date.slice(0, 10) && 
		inHour && inMinute && 
		outHour && outMinute,
	);
}
