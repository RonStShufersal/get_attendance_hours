import { Page } from 'puppeteer';
import { Automator } from '../Automator';
import { Day } from '../../types/HourDay';
import { UnsupportedConfigError } from '../../../errors/UnsupportedError';
import { getCredentials } from '../../../util/getCredentials';
import missingCredentialsError from '../../../errors/MissingCredentialsError';
import { LoginInputStrategy, SelectorLookupStrategy } from '../../types/LoginInputStrategy';
import { DefaultLoginStrategy } from '../../util/impl/DefaultLoginStrategy';
import formAutomationError from '../../../errors/FormAutomationError';
import { DayType } from '../../types/CommonTypes';

export class WebtimeAutomator extends Automator {
	protected INITIAL_URL = 'https://webtime.taldor.co.il/?msg=login&ret=wt_periodic.adp';

	protected readonly config = {
		dayModifiersSupport: {
			vacation: false,
			sickDays: false,
			splitDays: false,
		},
	};

	private readonly dayType2DescriptorRawValue: Record<DayType, string> = {
		[DayType.REGULAR]: '2791',
		[DayType.SICK_DAY]: '513',
		[DayType.VACATION]: '512',
	};

	async fillDays(days: Day[]): Promise<void> {
		this.validateConfigValues();
		const page = await super.page;
		await this.handleLogin(page);
		await this.navigateToTimesheet();
		await this.fillTimesheet(page, days);

		// dispose of opened page
		await page.close();
	}

	protected async handleLogin(page: Page): Promise<void> {
		const credentials = getCredentials('webtime');

		if (!credentials.username || !credentials.password) {
			missingCredentialsError('missing webtime username or password');
		}

		const expectedInputs: LoginInputStrategy[] = [
			{
				inputSelector: {
					rawSelector: 'email',
					lookupStrategy: SelectorLookupStrategy.BY_INPUT_NAME,
				},
				inputValue: credentials.username,
			},
			{
				inputSelector: {
					rawSelector: 'password',
					lookupStrategy: SelectorLookupStrategy.BY_INPUT_NAME,
				},
				inputValue: credentials.password,
			},
		];

		const loginStrategy = new DefaultLoginStrategy(page, expectedInputs, this.INITIAL_URL);
		await loginStrategy.handleLoginInputs();
		await page.waitForNetworkIdle();
	}

	protected async navigateToTimesheet(): Promise<void> {
		// empty implementation
		// page automatically navigates to timesheet
		return;
	}

	protected async fillTimesheet(page: Page, days: Day[]): Promise<void> {
		await this.selectAssignmentValue(page, DayType.REGULAR);

		days.map((a) => a);
		return;
	}

	protected validateConfigValues(): void {
		if (this.config.dayModifiersSupport.sickDays) {
			throw new UnsupportedConfigError('sick days are not currently supported');
		}
		if (this.config.dayModifiersSupport.splitDays) {
			throw new UnsupportedConfigError('split days scraping are not currently supported');
		}
		if (this.config.dayModifiersSupport.vacation) {
			console.log('webtime will fill vacation days');
		}
	}

	private async selectAssignmentValue(page: Page, dayType: DayType) {
		const selectElement = await page.$('#assignments');

		if (!selectElement) {
			formAutomationError('couldnt find select element');
		}

		await selectElement.select(this.dayType2DescriptorRawValue[dayType]);
	}
}
