import { Page } from 'puppeteer';
import formAutomationError from '../errors/FormAutomationError';

type FillInputOptions = {
	page: Page;
	inputSelector: string;
	inputValue: string;
	errorMsg?: string;
	earlyReturnOnNonEmpty?: boolean;
};

export async function fillInputByName(options: FillInputOptions) {
	const selector = `input[name=${options.inputSelector}]`;
	return fillInput({ ...options, inputSelector: selector });
}
export async function fillInputById(options: FillInputOptions) {
	const selector = `#${options.inputSelector}`;
	return fillInput({ ...options, inputSelector: selector });
}

async function fillInput({
	page,
	inputSelector,
	inputValue,
	errorMsg,
	earlyReturnOnNonEmpty,
}: FillInputOptions) {
	const element = await page.$(inputSelector);
	if (element === null) {
		formAutomationError(errorMsg ?? 'couldnt find input');
	}

	const input = await element.toElement('input');

	if (earlyReturnOnNonEmpty) {
		const value = await input.evaluate(({ value }) => value);
		if (value) {
			return;
		}
	}

	await input.type(inputValue);
}
