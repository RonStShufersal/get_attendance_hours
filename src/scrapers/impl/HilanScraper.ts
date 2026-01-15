import { Day } from '../../types/hours';
import { Scraper } from '../Scraper';
import { getCredentials } from '../../util/getCredentials';
import { DefaultLoginStrategy } from '../util/impl/DefaultLoginStrategy';
import { SelectorLookupStrategy } from '../types/LoginInputStrategy';
import missingCredentialsError from '../../errors/MissingCredentialsError';

export class HilanScraper extends Scraper {
	protected readonly INITIAL_URL: string = 'https://shufersal.net.hilan.co.il/login';

	async getDays(): Promise<Day[]> {
		const page = await super.getPage();
		const credentials = getCredentials('hilan');

		if (!credentials.username || !credentials.password) {
			missingCredentialsError('missing hilan username or password');
		}

		const expectedInputs = [
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
		return [];
	}
	private async navigateToHoursLog(): Promise<void> {
		return;
	}

	private async scrapeDays(): Promise<Day[]> {
		return [];
	}
}
