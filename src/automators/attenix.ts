import { Page } from 'puppeteer';
import formAutomationError from '../errors/FormAutomationError';
import { Day } from '../types/hours';
import fillInput from '../util/fillInput';
import { connect } from '../connect';
import { AttendixDayHours } from '../types/attendix';
import { getHourFromHours, getMinutesFromHours, getDayFromDayType } from '../util/deconstructors';

const attentixLogin = `https://webtime.taldor.co.il/?msg=login&ret=wt_periodic.adp`;
const ATTENDIX_DAYS_TABLE_ID = 'tableDyn1';

export async function automateAttenixHoursEntry(days: Day[]) {
	const username = process.env.ATTENIX_USERNAME;
	const password = process.env.ATTENIX_PASSWORD;

	if (!username || !password) {
		throw new Error('Missing for attenix automator: username or password');
	}
	const browser = await connect();
	const page = await browser.newPage();

	await handleLogin(page, { username, password });
	await fillOutAttendixHoursAndSubmit(page, days);
}

async function handleLogin(page: Page, credentials: { username: string; password: string }) {
	await page.goto(attentixLogin, { waitUntil: 'networkidle2' });

	const { password, username } = credentials;
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

	const submitButton = await page.$('#login-button');

	if (submitButton === null) {
		formAutomationError('couldnt find submit button');
	}

	await submitButton.click();

	await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

async function fillOutAttendixHoursAndSubmit(page: Page, days: Day[]) {
	console.log(days);

	const button = await page.$('#save_btn');

	if (!button) {
		formAutomationError('couldnt find save button');
	}

	await chooseAttentixAssignment(page);

	for (const day of days) {
		try {
			const tr = await page.$(getTrannySelector(day));
			if (!tr) {
				formAutomationError(`couldnt find tr for day ${day.dayValue}`);
			}
		} catch (error) {
			console.log('ending early:');
			console.error(error);
			process.exit(1);
		}

		// fill mission
		await fillMissionInput(page, day);

		await handleFillHourInputsStartAndEnd(page, day);
	}

	// await button.click();

	// await page.waitForNetworkIdle({ idleTime: 1000 });
}

async function chooseAttentixAssignment(page: Page) {
	const RELEVANT_OPTION_VALUE = `2791`;
	const selectElement = await page.$('#assignments');

	if (!selectElement) {
		formAutomationError('couldnt find select element');
	}

	await selectElement.select(RELEVANT_OPTION_VALUE);
}

async function handleFillHourInputsStartAndEnd(page: Page, day: Day) {
	const { start, end } = getHoursSelectors(day);

	const hourIn = String(getHourFromHours(day.hours.in));
	const minuteIn = String(getMinutesFromHours(day.hours.in));

	const hourOut = String(getHourFromHours(day.hours.out));
	const minuteOut = String(getMinutesFromHours(day.hours.out));

	const defaultOptions = { page, earlyReturnOnNonEmpty: true };

	await fillInput({
		...defaultOptions,
		inputSelector: start.hour,
		inputValue: hourIn,
	});
	await fillInput({
		...defaultOptions,
		inputSelector: start.minute,
		inputValue: minuteIn,
	});

	await fillInput({
		...defaultOptions,
		inputSelector: end.hour,
		inputValue: hourOut,
	});
	await fillInput({
		...defaultOptions,
		inputSelector: end.minute,
		inputValue: minuteOut,
	});
}

async function fillMissionInput(page: Page, day: Day, forceFill = false) {
	const missionInput = await page.$(getTrannySelector(day) + ' input[fieldname="assignment_name"] ');

	if (!missionInput) {
		formAutomationError('couldnt find mission input');
	}

	const currentValue = await missionInput.evaluate((input) => (input as HTMLInputElement).value);

	if (currentValue && !forceFill) {
		return;
	}

	await missionInput.click();
}

function getTrannySelector(day: Day): string {
	return `[id=${ATTENDIX_DAYS_TABLE_ID}] tr[row_no="${getDayFromDayType(day)}"]`;
}

function getHoursSelectors(day: Day): AttendixDayHours {
	const dayNumber = getDayFromDayType(day);
	return {
		start: {
			hour: `time_start_HH_${dayNumber}`,
			minute: `time_start_MM_${dayNumber}`,
		},
		end: {
			hour: `time_end_HH_${dayNumber}`,
			minute: `time_end_MM_${dayNumber}`,
		},
	};
}
