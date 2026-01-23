import { Page } from 'puppeteer';
import { connect } from '../connect';
import { Day } from '../types/hours';

export abstract class Scraper {
	protected abstract readonly INITIAL_URL: string;
	protected abstract readonly config: Record<string, unknown>;
	private async _page() {
		const browser = await connect();
		return await browser.newPage();
	}

	/**
	 * Returns a new page.
	 *
	 * *Note* - calling this will create a new page each time. Be sure to dispose of it when you're done.
	 */
	protected async getPage(): Promise<Page> {
		return await this._page();
	}

	abstract getDays(): Promise<Day[]>;
	protected abstract handleLogin(page: Page): Promise<void>;
	protected abstract navigateToHoursLog(page: Page): Promise<void>;
	protected abstract validateConfigValues(): void;
}
