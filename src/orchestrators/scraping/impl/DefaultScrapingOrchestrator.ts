import { HilanScraper } from '../../../clients/scrapers/impl/HilanScraper';
import { getDaysFromSynerion } from '../../../clients/scrapers/synerion';
import { Day } from '../../../clients/types/HourDay';
import scrapeError from '../../../errors/ScrapingError';
import { ScrapingOrchestrator } from '../ScrapingOrchestrator';

export class DefaultScrapingOrchestrator extends ScrapingOrchestrator {
	constructor() {
		super('scraper');
	}

	async scrapeDays(): Promise<Day[]> {
		const target = this.target;

		let days: Day[];

		switch (target) {
			case 'synerion':
				days = await this.scrapeFromSynerion();
				break;

			case 'hilan':
				days = await this.scrapeFromHilan();
				break;

			default:
				console.error('scraping target not recognized, exiting');
				process.exit(1);
		}

		return days;
	}

	private async scrapeFromHilan(): Promise<Day[]> {
		const scraper = new HilanScraper();
		const days = await scraper.getDays();
		if (!days?.length) {
			scrapeError('No days scraped from hilan');
		}
		return days;
	}

	private async scrapeFromSynerion(): Promise<Day[]> {
		const days = await getDaysFromSynerion();
		if (!days?.length) {
			scrapeError('No days scraped from synerion');
		}
		return days;
	}
}
