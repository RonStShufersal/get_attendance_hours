import { Page } from 'puppeteer';
import { LoginStrategy } from '../LoginStrategy';
import { LoginInputStrategy, SelectorLookupStrategy } from '../../types/LoginInputStrategy';
import illegalArgumentError from '../../../errors/IllegalArgumentsError';
import formAutomationError from '../../../errors/FormAutomationError';
import { fillInputById, fillInputByName, FillInputOptions } from '../../../util/fillInput';

export class DefaultLoginStrategy implements LoginStrategy {
	page: Page;
	expectedInputs: LoginInputStrategy[];
	loginUrl: string;

	constructor(page: Page, expectedInputs: LoginInputStrategy[], loginUrl: string) {
		this.page = page;
		this.expectedInputs = expectedInputs;
		this.loginUrl = loginUrl;
	}

	async handleLoginInputs(): Promise<void> {
		if (!this.page || !this.expectedInputs || !this.loginUrl) {
			illegalArgumentError(
				'missing page, expectedInputs, or loginUrl: ' +
					JSON.stringify([!this.page, this.expectedInputs, this.loginUrl]),
			);
		}

		await this.page.goto(this.loginUrl, { waitUntil: 'networkidle2' });

		for (const input of this.expectedInputs) {
			await this.fillInput(input);
		}

		const submitButton = await this.page.$('button[type=submit]');
		if (submitButton === null) {
			formAutomationError('couldnt find submit button');
		}

		await submitButton?.click();
		await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
	}

	private async fillInput(input: LoginInputStrategy): Promise<void> {
		if (input.inputValue instanceof Date) {
			input.inputValue = input.inputValue.toISOString();
		}
		const functionPayload: FillInputOptions = {
			inputSelector: input.inputSelector.rawSelector,
			inputValue: String(input.inputValue),
			errorMsg: input.errorMsg || 'couldnt fill input',
			page: this.page,
		};

		switch (input.inputSelector.lookupStrategy) {
			case SelectorLookupStrategy.BY_ID:
				await fillInputById(functionPayload);
				break;
			case SelectorLookupStrategy.BY_INPUT_NAME:
				await fillInputByName(functionPayload);
				break;

			default:
				break;
		}
	}
}
