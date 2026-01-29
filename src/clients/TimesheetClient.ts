import { Page } from 'puppeteer';
import { connect } from '../connect';

export abstract class TimesheetClient {
	protected abstract readonly INITIAL_URL: string;
	protected abstract readonly config: Record<string, unknown>;

	private async _page() {
		const browser = await connect();
		return await browser.newPage();
	}

	protected get page(): Promise<Page> {
		return this._page();
	}

	protected abstract handleLogin(page: Page): Promise<void>;
	protected abstract navigateToTimesheet(page: Page): Promise<void>;
	protected abstract validateConfigValues(): void;
}
