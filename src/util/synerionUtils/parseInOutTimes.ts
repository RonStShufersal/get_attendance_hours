import scrapeError from '@/errors/ScrapingError';
import { Hour } from '@/types/hours';
import { stringIsHourBase } from '@/util/types/typeChecks';
import { In, Out } from '@/types/synerion';

export default function parseInOutTimes(In: In, Out: Out): { in: Hour; out: Hour } {
	if (!stringIsHourBase(In.Time) || !stringIsHourBase(Out.Time)) {
		scrapeError(`${In.Time}, ${Out.Time}`);
	}
	return { in: In.Time, out: Out.Time };
}
