import { Day, DayHours, DayValue, Hour } from '../../types/hours';
import { Scraper } from '../Scraper';
import { getCredentials } from '../../util/getCredentials';
import { DefaultLoginStrategy } from '../util/impl/DefaultLoginStrategy';
import { LoginInputStrategy, SelectorLookupStrategy } from '../types/LoginInputStrategy';
import missingCredentialsError from '../../errors/MissingCredentialsError';
import { Page } from 'puppeteer';
import formAutomationError from '../../errors/FormAutomationError';
import scrapeError from '../../errors/ScrapingError';
import { UnsupportedConfigError } from '../../errors/UnsupportedError';

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
		// ignore rows with empty values, config does not support any other behavior at the moment
		const dayHashMap: Record<DayValue, DayHours[]> = await page.$$eval(
			'tr[class]:has(tr td[id*=cellOf_ManualEntry] input[value])',
			(rows) =>
				rows
					// .filter((row) => !row.querySelector('input:not([value])'))
					.map((row) => {
						// extractDayValueFromRow
						const day = row.children[0].textContent
							?.split(' ')[0]
							.split('/')
							.map((n) => parseInt(n))
							.join('/') as DayValue | undefined;
						// if (!day) return;

						// const hours = extractHoursValueFromRow(row);
						const dayHoursInputs = row.querySelectorAll(
							'td[id*=cellOf_ManualEntry] input, td[id*=cellOf_ManualExit] input',
						);

						// if (dayHoursInputs?.length !== 2) {
						// 	throw new Error(`couldnt scrape hours from row ${row.id}, didn't find both inputs`);
						// }

						const hours = (Array.from(dayHoursInputs) as HTMLInputElement[]).map(
							(inpt) => inpt.value,
						) as Hour[];
						// if (hours.length != 2) {
						// 	throw new Error(`couldnt scrape hours from row ${row.id}, not properly formatted`);
						// }
						// dayHashMap[day] ??= [];
						// dayHashMap[day].push({
						// 	in: hours[0],
						// 	out: hours[1],
						// });

						return { day, hours };
					})
					.filter(({ day, hours }) => !!day && !!hours)
					.reduce(
						(p, c) => {
							if (c?.day) {
								p[c.day] ??= [];
								p[c.day].push({
									in: c.hours[0],
									out: c.hours[1],
								});
							}
							return p;
						},
						{} as Record<DayValue, DayHours[]>, // Prepare for split days support;)
					),
		);
		// console.log({ dayHashMap });
		return Object.entries(dayHashMap).map((entry) => ({
			dayValue: entry[0] as DayValue,
			hours: entry[1][0] as DayHours,
		}));
		// return dayArray;
	}

	// private hasEmptyInput(element: HTMLElement): boolean {
	// 	const anyEmpty = element.querySelector('input:not([value])');
	// 	return Boolean(anyEmpty);
	// }

	private validateConfigValues() {
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

	// private extractDayValueFromRow(row: HTMLTableRowElement): DayValue | undefined {
	// 	return row.children[0].textContent?.split(' ')[0].split('/').map(parseInt).join('/') as
	// 		| DayValue
	// 		| undefined;
	// }

	// private extractHoursValueFromRow(row: HTMLTableRowElement): DayHours {
	// 	const dayHoursInputs = row.querySelectorAll(
	// 		'td[id*=cellOf_ManualEntry] input, td[id*=cellOf_ManualExit] input',
	// 	);
	// 	if (dayHoursInputs?.length !== 2) {
	// 		throw new ScrapingError(`couldnt scrape hours from row ${row.id}, didn't find both inputs`);
	// 	}
	// 	const hours = (Array.from(dayHoursInputs) as HTMLInputElement[])
	// 		.map((inpt) => inpt.value)
	// 		.filter(stringIsHourBase);
	// 	if (hours.length != 2) {
	// 		throw new ScrapingError(`couldnt scrape hours from row ${row.id}, not properly formatted`);
	// 	}
	// 	return {
	// 		in: hours[0],
	// 		out: hours[1],
	// 	};
	// }
}
