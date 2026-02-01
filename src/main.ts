import { day2GroupedDays } from './converters/day2GroupedDays';
import { DefaultScrapingOrchestrator } from './orchestrators/scraping/impl/DefaultScrapingOrchestrator';
import { DefaultAutomatingOrchestrator } from './orchestrators/automating/impl/DefaultAutomatingOrchestrator';

export async function main() {
	const config = getTimesheetClientsConfig();

	const scraper = new DefaultScrapingOrchestrator(config);
	const days = await scraper.orchestrateDayScraping();

	const grouped = day2GroupedDays(days);

	const automator = new DefaultAutomatingOrchestrator(config);
	await automator.orchestrateDayAutomation(grouped);
}

function getTimesheetClientsConfig() {
	return {
		dayModifiersSupport: {
			sickDays: false,
			splitDays: false,
			vacation: true,
		},
	} as const;
}
