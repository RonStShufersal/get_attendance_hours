import { HTTPResponse } from 'puppeteer';
import { connect } from '../connect';
import { Day, Hour } from '../types/hours';
import { SynerionDayDTO, SynerionResponse } from '../types/synerion';
import { stringIsHourBase } from '../util/typeChecks';
import scrapeError from '../errors/ScrapingError';
import { dateFormat } from '../util/dateFormat';
import { isTimeInExpectedRanges } from '../util/validators';

const URL = 'https://lavieweb.corp.supersol.co.il/synerionweb/#/dailyBrowser';
const externalNetworkRequestURL = `https://lavieweb.corp.supersol.co.il/SynerionWeb/api/DailyBrowser/Attendance`;

export const getDaysFromSynerion = async (): Promise<Day[]> => {
	const browser = await connect();
	const page = await browser.newPage();
	const hoursWithDay = [] as Day[];
	await new Promise<void>((resolve) => {
		const eventHandler = async (response: HTTPResponse) => {
			if (
				response.url() !== externalNetworkRequestURL ||
				!response.ok ||
				response.request().method() !== 'POST'
			) {
				return;
			}
			const body = await response.json();
			hoursWithDay.push(...getDaysAndHoursFromSynerionResponse(body));
			page.off('response', eventHandler);
			resolve();
		};
		page.on('response', eventHandler);
		page.setViewport({ width: 1280, height: 1800 }).then(() => {
			page.goto(URL, { waitUntil: 'networkidle2' });
		});
	});

	return hoursWithDay;
};

function isDayValidAndReadyForSubmit(synDay: SynerionDayDTO, todayDate: string): boolean {
	if (!synDay.InOuts[0]?.In.Time || !synDay.InOuts[0]?.Out.Time) {
		return false;
	}
	const InTime = synDay.InOuts[0].In.Time;
	const OutTime = synDay.InOuts[0].Out.Time;

	const [inHour, inMinute] = InTime.split(':')
		.map((n) => parseInt(n))
		.slice(0, 2);
	const [outHour, outMinute] = OutTime.split(':')
		.map((n) => parseInt(n))
		.slice(0, 2);

	// prettier-ignore
	return Boolean(
		synDay.Date && todayDate !== synDay.Date.slice(0, 10) &&
		isTimeInExpectedRanges(inHour, inMinute) &&
		isTimeInExpectedRanges(outHour, outMinute)
	);
}

function getDaysAndHoursFromSynerionResponse(response: SynerionResponse): Day[] {
	const todayDate = '';
	// prettier-ignore
	return response
			.DailyBrowserDtos
			.filter((res) => isDayValidAndReadyForSubmit(res, todayDate))
			.map(mapSynerionDayDTOToDay);
}

function mapSynerionDayDTOToDay(dayDTO: SynerionDayDTO) {
	const { Date: day } = dayDTO;
	const { In, Out } = dayDTO.InOuts[0];

	if (!stringIsHourBase(In.Time) || !stringIsHourBase(Out.Time)) {
		scrapeError(`${In.Time}, ${Out.Time}`);
	}
	const inTime: Hour = In.Time;
	const outTime: Hour = Out.Time;
	return {
		dayValue: dateFormat(new Date(day)),
		hours: {
			in: inTime,
			out: outTime,
		},
	};
}

import { HTTPResponse } from 'puppeteer';
import { connect } from '@/connect';
import { Day } from '@/types/hours';
import { AUTOMATION_RESULT_CODE } from '@/types/codes';
import { setupPage } from '@/util/puppeteer';
import handleSynerionResponse from '@/util/synerionUtils/handleSynerionResponse';

const URL = 'https://lavieweb.corp.supersol.co.il/synerionweb/#/dailyBrowser';
const externalNetworkRequestURL = `https://lavieweb.corp.supersol.co.il/SynerionWeb/api/DailyBrowser/Attendance`;

export const scrapeFromSynerion = async (): Promise<Day[] | typeof AUTOMATION_RESULT_CODE.ERROR> => {
	try {
		const browser = await connect();
		const hoursWithDay = [] as Day[];
		const handleSynerionBodyCB = (e: HTTPResponse) =>
			handleSynerionResponse(e, hoursWithDay, externalNetworkRequestURL);
		await setupPage(URL, browser, handleSynerionBodyCB);
		return hoursWithDay;
	} catch (err) {
		console.error(err);
		return AUTOMATION_RESULT_CODE.ERROR;
	}
};
