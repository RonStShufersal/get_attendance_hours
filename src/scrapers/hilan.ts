import { Page } from 'puppeteer';
import { connect } from '../connect';
import formAutomationError from '../errors/FormAutomationError';
import { Day } from '../types/hours';
import { fillInputById } from '../util/fillInput';
import { getCredentials } from '../util/getCredentials';

const loginURL = 'https://shufersal.net.hilan.co.il/login';

export const getDaysFromHilan = async (): Promise<Day[]> => {
	const browser = await connect();
	const page = await browser.newPage();
	await handleLogin(page, getCredentials('hilan'));
	await handleNavigateToHoursLog(page);

	const hoursWithDay = [] as Day[];

	return hoursWithDay;
};

async function handleLogin(page: Page, credentials: { username?: string; password?: string }) {
	await page.goto(loginURL, { waitUntil: 'networkidle2' });

	const { password, username } = credentials;
	if (!username || !password) {
		throw new Error('cant login without credentials');
	}

	const inputs = [
		{
			inputSelector: 'user_nm',
			inputValue: username,
			errorMsg: 'couldnt find hilan username input',
		},
		{
			inputSelector: 'password_nm',
			inputValue: password,
			errorMsg: 'couldnt find hilan password input',
		},
	];

	for (const input of inputs) {
		await fillInputById({ ...input, page });
	}

	const submitButton = await page.$('button[type=submit]');

	if (submitButton === null) {
		formAutomationError('couldnt find submit button');
	}

	await submitButton.click();

	await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

async function handleNavigateToHoursLog(page: Page) {
	const hoursLogAnchorHref = await page.$eval('[href*=calendar]', (el) =>
		el ? (el as HTMLAnchorElement).href : formAutomationError('couldnt find hoursLogAnchor'),
	);

	if (!hoursLogAnchorHref) {
		formAutomationError('hoursLogAnchor is falsy');
	}

	page.goto(hoursLogAnchorHref);

	await page.waitForNavigation({ waitUntil: 'networkidle2' });
}
