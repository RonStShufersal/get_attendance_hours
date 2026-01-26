import { automateWebtimeHoursEntry } from './clients/automators/webtime';
import { HilanScraper } from './clients/scrapers/impl/HilanScraper';
import { getDaysFromSynerion } from './clients/scrapers/synerion';
import missingEnvironmentError from './errors/MissingEnvironmentError';
import scrapeError from './errors/ScrapingError';
import { UnsupportedTargetError } from './errors/UnsupportedError';
import { Day } from './clients/types/HourDay';

export async function main() {
	validateAllEnvVariablesExist();
	const scrapingTarget = process.env.SCRAPING_TARGET;
	const automationTarget = process.env.AUTOMATION_TARGET;
	const scrapingResponse: Day[] = [];
	switch (scrapingTarget) {
		case 'synerion':
			await populateDaysFromSynerion(scrapingResponse);
			break;

		case 'hilan':
			await populateDaysFromHilan(scrapingResponse);
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
		case 'webtime':
			await automateWebtimeHoursEntry(scrapingResponse);
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
}

async function populateDaysFromHilan(days: Day[]) {
	const scraper = new HilanScraper();
	const response = await scraper.getDays();
	if (!response?.length) {
		scrapeError('No days scraped from hilan');
	}
	days.push(...response);
}

function validateAllEnvVariablesExist() {
	if (process.env.AUTOMATION_TARGET !== 'webtime') {
		throw new UnsupportedTargetError('target is not "webtime"');
	}
	const username = process.env.SCRAPER_USERNAME;
	const password = process.env.SCRAPER_PASSWORD;

	if (!username || !password) {
		missingEnvironmentError('Missing env variables: SCRAPER_USERNAME or SCRAPER_PASSWORD');
	}
}
