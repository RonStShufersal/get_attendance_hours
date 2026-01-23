import { Day, DayHours, DayValue, Hour } from '../../types/hours';
import { Scraper } from '../Scraper';
import { getCredentials } from '../../util/getCredentials';
import { DefaultLoginStrategy } from '../util/impl/DefaultLoginStrategy';
import { LoginInputStrategy, SelectorLookupStrategy } from '../types/LoginInputStrategy';
import missingCredentialsError from '../../errors/MissingCredentialsError';
import { Page } from 'puppeteer';
import formAutomationError from '../../errors/FormAutomationError';
import scrapeError, { ScrapingError } from '../../errors/ScrapingError';
import { unsupportedConfigError, UnsupportedConfigError } from '../../errors/UnsupportedError';
import { RawDayRow } from '../types/CommonScrapingTypes';
import { stringIsHourBase } from '../../util/typeChecks';

export class HilanScraper extends Scraper {
	protected readonly INITIAL_URL: string = 'https://shufersal.net.hilan.co.il/login';

	protected readonly config = {
		dayModifiersSupport: {
			vacation: false,
			sickDays: false,
			splitDays: false,
		},
	};

	async getDays(): Promise<Day[]> {
		this.validateConfigValues();
		const page = await super.getPage();
		await this.handleLogin(page);
		await this.navigateToHoursLog(page);
		await this.prepareHoursLogPageForScraping(page);
		const days = await this.scrapeDays(page);
		console.log({ days });
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

		await page.click('input[id*=RefreshSelectedDays]');

		await page.waitForNetworkIdle();
	}

	private async scrapeDays(page: Page): Promise<Day[]> {
		const rawRows = await this.extractRawRows(page);
		const dayHashMap = this.buildDayHashMap(rawRows);

		return Object.entries(dayHashMap).map(([dayValue, hours]) => {
			const resolvedHours = this.resolveHoursForDay(hours);
			return {
				dayValue: dayValue as DayValue,
				hours: resolvedHours,
			};
		});
	}

	protected validateConfigValues() {
		if (this.config.dayModifiersSupport.sickDays) {
			throw new UnsupportedConfigError('sick days scraping are not currently supported');
		}
		if (this.config.dayModifiersSupport.splitDays) {
			throw new UnsupportedConfigError('split days scraping are not currently supported');
		}
		if (this.config.dayModifiersSupport.vacation) {
			throw new UnsupportedConfigError('vacation days scraping are not currently supported');
		}
	}

	private async extractRawRows(page: Page): Promise<RawDayRow[]> {
		let rowSelector = 'tr[class]:has(tr td[id*=cellOf_ManualEntry]';

		// ignore rows with empty values, config does not support any other behavior at the moment
		if (!this.config.dayModifiersSupport.sickDays && !this.config.dayModifiersSupport.vacation) {
			rowSelector += ' input[value]';
		}

		rowSelector += ')';
		return page.$$eval(rowSelector, (rows) =>
			rows.map((row) => {
				const day = row.children[0]?.textContent
					?.split(' ')[0]
					.split('/')
					.map((n) => parseInt(n))
					.join('/') as DayValue | undefined;

				const hours = Array.from(
					row.querySelectorAll<HTMLInputElement>(
						'td[id*=cellOf_ManualEntry] input, td[id*=cellOf_ManualExit] input',
					),
				).map((i) => i.value as Hour);

				return { day, hours };
			}),
		);
	}

	private buildDayHashMap(rows: RawDayRow[]): Record<DayValue, DayHours[]> {
		return rows.reduce(
			(dayHashMap, row) => {
				if (row.day) {
					if (row.hours.length !== 2) {
						throw new ScrapingError(`Invalid hours for day ${row.day}`);
					}

					const [inHour, outHour] = row.hours;

					if (!stringIsHourBase(inHour) || !stringIsHourBase(outHour)) {
						throw new ScrapingError(`Malformed hour for day ${row.day}`);
					}

					dayHashMap[row.day] ??= [];
					dayHashMap[row.day].push({ in: inHour, out: outHour });
				}

				return dayHashMap;
			},
			{} as Record<DayValue, DayHours[]>,
		);
	}

	private resolveHoursForDay(hours: DayHours[]): DayHours {
		if (this.config.dayModifiersSupport.splitDays) {
			unsupportedConfigError('feature not implemented');
		}

		return hours[0];
	}
}
