import { Day } from '@/types/hours';
import { SynerionResponse } from '@/types/synerion';
import { isDayValidAndReadyForSubmit, mapToDay } from '@/util/synerionUtils/';

export default function getDaysAndHoursFromSynerionResponse({ DailyBrowserDtos }: SynerionResponse): Day[] {
	const todayDateString = new Date().toISOString().slice(0, 10);
	return DailyBrowserDtos.filter((res) => isDayValidAndReadyForSubmit(res, todayDateString)).map(mapToDay);
}
