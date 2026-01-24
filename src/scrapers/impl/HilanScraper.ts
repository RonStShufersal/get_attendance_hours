import { Day, DayHoursWithDayModifier, DayValue, Hour } from '../../types/hours';
import { Scraper } from '../Scraper';
import { getCredentials } from '../../util/getCredentials';
import { DefaultLoginStrategy } from '../util/impl/DefaultLoginStrategy';
import { LoginInputStrategy, SelectorLookupStrategy } from '../types/LoginInputStrategy';
import missingCredentialsError from '../../errors/MissingCredentialsError';
import { Page } from 'puppeteer';
import formAutomationError from '../../errors/FormAutomationError';
import scrapeError, { ScrapingError } from '../../errors/ScrapingError';
import { unsupportedConfigError, UnsupportedConfigError } from '../../errors/UnsupportedError';
import { DayModifiers, RawDayRow } from '../types/CommonScrapingTypes';
import { stringIsHourBase } from '../../util/typeChecks';

export class HilanScraper extends Scraper {
	protected readonly INITIAL_URL: string = 'https://shufersal.net.hilan.co.il/login';

	protected readonly config = {
		dayModifiersSupport: {
			vacation: true,
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

		// dispose of opened page
		await page.close();

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

		// unmark current day, as the empty value can break next functions.
		// when supporting split days, current day might interest us - but for now we ignore them.
		await page.click('.currentDay');

		await page.click('input[id*=RefreshSelectedDays]');

		await page.waitForNetworkIdle();
	}

	private async scrapeDays(page: Page): Promise<Day[]> {
		const rawRows = await this.extractRawRows(page);
		const dayHashMap = this.buildDayHashMap(rawRows);

		let normalizedDays = Object.entries(dayHashMap).map(([dayValue, hours]): Day => {
			const resolvedHours = this.resolveHoursAndModifiersForDay(hours);
			return {
				dayValue: dayValue as DayValue,
				hours: resolvedHours.hours,
				modifier: resolvedHours.modifier,
			};
		});

		if (!this.config.dayModifiersSupport.sickDays) {
			normalizedDays = normalizedDays.filter((day) => day.modifier !== DayModifiers.SICK_DAY);
		}

		if (!this.config.dayModifiersSupport.vacation) {
			normalizedDays = normalizedDays.filter((day) => day.modifier !== DayModifiers.VACATION);
		}

		return normalizedDays;
	}

	protected validateConfigValues() {
		if (this.config.dayModifiersSupport.sickDays) {
			console.log('hilan will scrape sick days');
		}
		if (this.config.dayModifiersSupport.splitDays) {
			throw new UnsupportedConfigError('split days scraping are not currently supported');
		}
		if (this.config.dayModifiersSupport.vacation) {
			console.log('hilan will scrape vacation days');
		}
	}

	private async extractRawRows(page: Page): Promise<RawDayRow[]> {
		const rowSelector = 'tr[class]:has(tr td[id*=cellOf_ManualEntry])';

		return page.$$eval(rowSelector, (rows) =>
			rows.map((row): RawDayRow => {
				const day = row.children[0]?.textContent
					?.split(' ')[0]
					.split('/')
					.map((n) => parseInt(n))
					.join('/') as DayValue | undefined;

				// current implementation assumes only 1 pair of inputs (entry and exit)
				// split days can return 2+, but it will always be (even=entry, odd=exit)
				const hours = Array.from(
					row.querySelectorAll<HTMLInputElement>(
						'td[id*=cellOf_ManualEntry] input, td[id*=cellOf_ManualExit] input',
					),
				).map((i) => i.value as Hour);

				return { day, hours, selectElementTitle: row.querySelector('select')?.title };
			}),
		);
	}

	private buildDayHashMap(rows: RawDayRow[]): Record<DayValue, DayHoursWithDayModifier[]> {
		return rows.reduce(
			(dayHashMap, row) => {
				if (row.day) {
					// split days incompatibility
					if (row.hours.length !== 2) {
						throw new ScrapingError(`Invalid hours for day ${row.day}`);
					}

					// split days incompatibility
					const [inHour, outHour] = row.hours;
					const dayModifier = this.resolveSelectTitle(row.selectElementTitle);

					if ((!stringIsHourBase(inHour) || !stringIsHourBase(outHour)) && dayModifier === null) {
						throw new ScrapingError(`Malformed hour for day ${row.day}`);
					}

					dayHashMap[row.day] ??= [];
					dayHashMap[row.day].push({
						in: inHour,
						out: outHour,
						modifier: dayModifier,
					});
				}

				return dayHashMap;
			},
			{} as Record<DayValue, DayHoursWithDayModifier[]>,
		);
	}

	private resolveHoursAndModifiersForDay(hours: DayHoursWithDayModifier[]): Omit<Day, 'dayValue'> {
		if (this.config.dayModifiersSupport.splitDays) {
			unsupportedConfigError('feature not implemented');
		}

		return {
			hours: hours[0],
			modifier: hours[0].modifier,
		};
	}

	private resolveSelectTitle(value?: string): DayModifiers | null {
		if (this.normalizeHebrew(value) === this.normalizeHebrew('מחלה')) {
			return DayModifiers.SICK_DAY;
		}

		if (this.normalizeHebrew(value) === this.normalizeHebrew('חופשה')) {
			return DayModifiers.VACATION;
		}

		return null;
	}

	private normalizeHebrew(str?: string): string {
		return (str ?? '')
			.normalize('NFKC') // normalize Unicode variants
			.replace(/\p{P}+/gu, '') // remove all punctuation (Unicode-safe)
			.replace(/\s+/g, ' ') // normalize whitespace (optional)
			.trim();
	}
}
