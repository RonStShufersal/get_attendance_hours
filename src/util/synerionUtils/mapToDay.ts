import { Day } from '@/types/hours';
import { SynerionDayDTO } from '@/types/synerion';
import { dateFormat } from '@/util/scrapingUtils/';
import { parseInOutTimes } from '@/util/synerionUtils/';

export default function mapToDay(res: SynerionDayDTO): Day {
	const { Date: day } = res;
	const { In, Out } = res.InOuts[0];
	const { in: inTime, out: outTime } = parseInOutTimes(In, Out);

	return {
		dayValue: dateFormat(new Date(day)),
		hours: { in: inTime, out: outTime },
	};
}
