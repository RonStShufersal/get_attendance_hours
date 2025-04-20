import { Page } from 'puppeteer';
import { connect } from '@/connect';
import formAutomationError from '@/errors/FormAutomationError';
import { Day } from '@/types/hours';
import { getHourFromHours, getMinutesFromHours } from '@/util/types/deconstructors';
import { fillInput } from '@/util/scrapingUtils/';
import { AUTOMATION_RESULT_CODE, TAutomationResultCode } from '@/types/codes';
import { setupPage } from '@/util/puppeteer';
import { getAttenixCredentials, getHoursSelectors, getTableRowSelector } from '@/util/attenixUtils';

// constants
const attentixLogin = `https://webtime.taldor.co.il/?msg=login&ret=wt_periodic.adp`;
const ATTENIX_DAYS_TABLE_ID = 'tableDyn1';
const RELEVANT_OPTION_VALUE = `2791`;

export const submitAttenixHours = async (daysPayload: Day[]): Promise<TAutomationResultCode> => {
	const [username, password] = getAttenixCredentials();
	try {
		if (!username || !password) {
			throw new Error('please provide both a username and a password');
		}

		const browser = await connect();
		const page = await setupPage(attentixLogin, browser);

		await handleLoginAttenix(page);
		await fillOutAttenixHoursAndSubmit(page, daysPayload);

		// TODO: uncomment this part
		// await browser.close();

		return AUTOMATION_RESULT_CODE.OK;
	} catch (err) {
		console.error(err);
		return AUTOMATION_RESULT_CODE.ERROR;
	}
};

async function handleLoginAttenix(page: Page) {
	const [username, password] = getAttenixCredentials();

	if (!username || !password) {
		throw new Error('cant login without credentials');
	}

	const inputs = [
		{
			inputSelector: 'email',
			inputValue: username,
			errorMsg: 'couldnt find attentix email input',
		},
		{
			inputSelector: 'password',
			inputValue: password,
			errorMsg: 'couldnt find attentix password input',
		},
	];

	for (const input of inputs) {
		await fillInput({ ...input, page });
	}

	const submitButton = await page.$('#image1');

	if (submitButton === null) {
		formAutomationError('couldnt find submit button');
	}

	await submitButton.click();

	await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

async function chooseAttentixAssignment(page: Page) {
	const selectElement = await page.$('#assignments');

	if (!selectElement) {
		formAutomationError('couldnt find select element');
	}

	await selectElement.select(RELEVANT_OPTION_VALUE);
}

async function fillOutAttenixHoursAndSubmit(page: Page, days: Day[]) {
	console.log(days);

	const button = await page.$('#save_btn');

	if (!button) {
		formAutomationError('couldnt find save button');
	}

	await chooseAttentixAssignment(page);

	for (const day of days) {
		try {
			const tr = await page.$(rowSelector(day));
			if (!tr) {
				formAutomationError(`couldnt find tr for day ${day.dayValue}`);
			}
		} catch (error) {
			console.log('ending early:');
			console.error(error);
			process.exit(1);
		}

		await fillMissionInput(page, day);

		await handleFillHourInputsStartAndEnd(page, day);
	}

	// TODO: uncomment this
	// await button.click();
	// await page.waitForNetworkIdle({ idleTime: 1000 });
}

async function handleFillHourInputsStartAndEnd(page: Page, day: Day) {
	const { start, end } = getHoursSelectors(day);

	const hourIn = String(getHourFromHours(day.hours.in));
	const minuteIn = String(getMinutesFromHours(day.hours.in));

	const hourOut = String(getHourFromHours(day.hours.out));
	const minuteOut = String(getMinutesFromHours(day.hours.out));

	await fillInput({
		page,
		inputSelector: start.hour,
		inputValue: hourIn,
	});
	await fillInput({
		page,
		inputSelector: start.minute,
		inputValue: minuteIn,
	});

	await fillInput({
		page,
		inputSelector: end.hour,
		inputValue: hourOut,
	});
	await fillInput({
		page,
		inputSelector: end.minute,
		inputValue: minuteOut,
	});
}

async function fillMissionInput(page: Page, day: Day) {
	const missionInput = await page.$(rowSelector(day) + ' input[fieldname="assignment_name"] ');

	if (!missionInput) {
		formAutomationError('couldnt find mission input');
	}

	await missionInput.click();
}

function rowSelector(day: Day) {
	return getTableRowSelector(ATTENIX_DAYS_TABLE_ID, day);
}
