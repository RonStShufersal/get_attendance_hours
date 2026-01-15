import { Day } from '../../types/hours';
import { Scraper } from '../Scraper';
import { getCredentials } from '../../util/getCredentials';
import { DefaultLoginStrategy } from '../util/impl/DefaultLoginStrategy';
import { LoginInputStrategy, SelectorLookupStrategy } from '../types/LoginInputStrategy';
import missingCredentialsError from '../../errors/MissingCredentialsError';
import { Page } from 'puppeteer';
import formAutomationError from '../../errors/FormAutomationError';
import scrapeError from '../../errors/ScrapingError';

export class HilanScraper extends Scraper {
	protected readonly INITIAL_URL: string = 'https://shufersal.net.hilan.co.il/login';

	async getDays(): Promise<Day[]> {
		const page = await super.getPage();
		await this.handleLogin(page);
		await this.navigateToHoursLog(page);
		await this.prepareHoursLogPageForScraping(page);
		const days = await this.scrapeDays(page);
		return days;
	}

	protected async handleLogin(page: Page): Promise<void> {
		const credentials = getCredentials('hilan');

		if (!credentials.username || !credentials.password) {
			missingCredentialsError('missing hilan username or password');
		}

		const expectedInputs: LoginInputStrategy[] = [
			{
				inputSelector: {
					rawSelector: 'user_nm',
					lookupStrategy: SelectorLookupStrategy.BY_ID,
				},
				inputValue: credentials.username,
				errorMsg: 'couldnt find hilan username input',
			},
			{
				inputSelector: {
					rawSelector: 'password_nm',
					lookupStrategy: SelectorLookupStrategy.BY_ID,
				},
				inputValue: credentials.password,
				errorMsg: 'couldnt find hilan password input',
			},
		];

		const loginStrategy = new DefaultLoginStrategy(page, expectedInputs, this.INITIAL_URL);
		await loginStrategy.handleLoginInputs();
		await page.waitForNetworkIdle();
	}
	protected async navigateToHoursLog(page: Page): Promise<void> {
		const hoursLogAnchorHref = await page.$eval('[href*=calendarpage]', (el) =>
			el ? (el as HTMLAnchorElement).href : formAutomationError('couldnt find hoursLogAnchor'),
		);

		if (!hoursLogAnchorHref) {
			formAutomationError('hoursLogAnchor is falsy');
		}

		page.goto(hoursLogAnchorHref);

		await page.waitForNavigation({ waitUntil: 'networkidle2' });
	}

	private async prepareHoursLogPageForScraping(page: Page): Promise<void> {
		const collectValidDays = await page.$$(`#calendar_container tr:nth-child(n+3) td[title]`);

		if (!collectValidDays.length) {
			return scrapeError('couldnt find days with hours logged');
		}

		for (const element of collectValidDays) {
			await element.click();
		}

		await page.click('[id*=RefreshSelectedDays]');

		await page.waitForNetworkIdle();
	}

	private async scrapeDays(page: Page): Promise<Day[]> {
		// Use the following logic for entry/exit, branch out of the DOM node
		//document.querySelectorAll('td[id*=cellOf_ManualEntry], td[id*=cellOf_ManualExit]')[0].parentElement.previousSibling
		return [];
	}
}
