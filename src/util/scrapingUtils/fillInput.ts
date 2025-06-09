import { Page } from 'puppeteer';
import formAutomationError from '@/errors/FormAutomationError';

export default async function fillInput({
	page,
	inputSelector,
	inputValue,
	errorMsg,
	earlyReturnOnNonEmpty,
}: {
	page: Page;
	inputSelector: string;
	inputValue: string;
	errorMsg?: string;
	earlyReturnOnNonEmpty?: boolean;
}) {
	const input = await page.$(`input[name=${inputSelector}]`);
	if (input === null) {
		formAutomationError(errorMsg ?? 'couldnt find input');
	}

	if (earlyReturnOnNonEmpty) {
		const value = await input.evaluate(({ value }) => value);
		if (value) {
			return;
		}
	}

	await input.type(inputValue);
}
