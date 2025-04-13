import { Day } from '@/types/hours';
import { HTTPResponse } from 'puppeteer';
import { getDaysAndHoursFromSynerionResponse } from '@/util/synerionUtils/';

export default async function handleSynerionResponse(
	response: HTTPResponse,
	hoursWithDay: Day[],
	externalNetworkRequestURL: string,
): Promise<void> {
	if (response.url() !== externalNetworkRequestURL || !response.ok) {
		return;
	}
	const body = await response.json();
	hoursWithDay.push(...getDaysAndHoursFromSynerionResponse(body));
}
