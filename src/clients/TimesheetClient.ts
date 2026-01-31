import { Page } from 'puppeteer';
import { connect } from '../connect';
import { TimeSheetConfig } from './types/Config';

const REUSED_RESOURCES: { page?: Page } = {};
export abstract class TimesheetClient {
	protected abstract readonly INITIAL_URL: string;
	protected abstract config: TimeSheetConfig;
	protected readonly openedPages = REUSED_RESOURCES;

	private async _page() {
		const browser = await connect();
		const page = await browser.newPage();
		this.openedPages.page = page;
		return page;
	}

	protected get page(): Promise<Page> {
		if (this.openedPages.page) {
			return Promise.resolve(this.openedPages.page);
		}
		return this._page();
	}

	protected abstract handleLogin(page: Page): Promise<void>;
	protected abstract navigateToTimesheet(page: Page): Promise<void>;
	protected abstract validateConfigValues(): void;
}
