import { Day } from '@/types/hours';
import { getDayFromDayType } from '@/util/types/deconstructors';

export default function getTableRowSelector(tableID: string, day: Day): string {
	return `[id=${tableID}] tr[row_no="${getDayFromDayType(day)}"]`;
}
