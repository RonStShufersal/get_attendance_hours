import { automateAttenixHoursEntry } from './automators/attenix';
import missingEnvironmentError from './errors/MissingEnvironmentError';
import scrapeError from './errors/ScrapingError';
import { getDaysFromSynerion } from './scripts/synerion';
import { Day } from './types/hours';

export async function main() {
	validateAllEnvVariablesExist();
	const scrapingTarget = process.env.SCRAPING_TARGET;
	const automationTarget = process.env.AUTOMATION_TARGET;
	const scrapingResponse: Day[] = [];
	switch (scrapingTarget) {
		case 'synerion':
			await populateDaysFromSynerion(scrapingResponse);
			break;

		case undefined:
			console.error('No SCRAPING_TARGET provided, exiting');
			process.exit(1);
			break;

		default:
			console.error('SCRAPING_TARGET not recognized, exiting');
			process.exit(1);
			break;
	}
	switch (automationTarget) {
		case 'attenix':
			await automateAttenixHoursEntry(scrapingResponse);
			break;

		case undefined:
			console.error('No AUTOMATION_TARGET provided, exiting');
			process.exit(1);
			break;

		default:
			console.error('AUTOMATION_TARGET not recognized, exiting');
			process.exit(1);
			break;
	}
}

async function populateDaysFromSynerion(days: Day[]) {
	const response = await getDaysFromSynerion();
	if (!response?.length) {
		scrapeError('No days scraped from synerion');
	}
	days.push(...response);
	return;
}

function validateAllEnvVariablesExist() {
	const username = process.env.ATTENIX_USERNAME;
	const password = process.env.ATTENIX_PASSWORD;

	if (!username || !password) {
		missingEnvironmentError('Missing env variables: ATTENIX_USERNAME or ATTENIX_PASSWORD');
	}
}
