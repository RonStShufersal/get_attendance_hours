import missingEnvironmentError from './errors/MissingEnvironmentError';
import { day2GroupedDays } from './converters/day2GroupedDays';
import { DefaultScrapingOrchestrator } from './orchestrators/scraping/impl/DefaultScrapingOrchestrator';
import { DefaultAutomatingOrchestrator } from './orchestrators/automating/impl/DefaultAutomatingOrchestrator';

export async function main() {
	validateAllEnvVariablesExist();

	const scraper = new DefaultScrapingOrchestrator();
	const days = await scraper.scrapeDays();

	const grouped = day2GroupedDays(days);

	const automator = new DefaultAutomatingOrchestrator();
	await automator.fillDays(grouped);

	console.log('operation success!');
}

function validateAllEnvVariablesExist() {
	const variables = [
		{ name: 'AUTOMATION_TARGET', value: process.env.AUTOMATION_TARGET },
		{ name: 'AUTOMATOR_USERNAME', value: process.env.AUTOMATOR_USERNAME },
		{ name: 'AUTOMATOR_PASSWORD', value: process.env.AUTOMATOR_PASSWORD },
		{ name: 'SCRAPING_TARGET', value: process.env.SCRAPING_TARGET },
		{ name: 'SCRAPER_USERNAME', value: process.env.SCRAPER_USERNAME },
		{ name: 'SCRAPER_PASSWORD', value: process.env.SCRAPER_PASSWORD },
	];

	for (const variable of variables) {
		if (!variable.value) {
			missingEnvironmentError('Missing env variable ' + variable.name);
		}
	}
}
