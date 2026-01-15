import { connect } from '../connect';
import { Day } from '../types/hours';

export abstract class Scraper {
	protected abstract readonly INITIAL_URL: string;
	private async _page() {
		const browser = await connect();
		return await browser.newPage();
	}

	protected async getPage() {
		return await this._page();
	}

	abstract getDays(): Promise<Day[]>;

	// abstract handleLogin(): Promise<void>;
	// abstract navigateToHoursLog(): Promise<void>;
	// abstract scrapeDays(): Promise<Day[]>;
}
