import { HTTPResponse } from 'puppeteer';
import { connect } from '../connect';
import { Day, Hour } from '../types/hours';
import { SynerionDayDTO, SynerionResponse } from '../types/synerion';
import { stringIsHourBase } from '../util/typeChecks';
import scrapeError from '../errors/ScrapingError';
import { dateFormat } from '../util/dateFormat';

const URL = 'https://lavieweb.corp.supersol.co.il/synerionweb/#/dailyBrowser';
const externalNetworkRequestURL = `https://lavieweb.corp.supersol.co.il/SynerionWeb/api/DailyBrowser/Attendance`;

export const scrapeFromSynerion = async (): Promise<Day[]> => {
	const browser = await connect();
	const page = await browser.newPage();
	let hoursWithDay = [] as Day[];
	const eventHandler = async (response: HTTPResponse) => {
		if (response.url() !== externalNetworkRequestURL || !response.ok) {
			return;
		}
		const body = await response.json();
		hoursWithDay = getDaysAndHoursFromSynerionResponse(body);
	};
	page.on('response', eventHandler);
	await page.setViewport({ width: 1920, height: 1280 });
	await page.goto(URL, { waitUntil: 'networkidle2' });
	page.off('response', eventHandler);

	return hoursWithDay;
};

function getDaysAndHoursFromSynerionResponse({ DailyBrowserDtos }: SynerionResponse): Day[] {
	const todayDateString = new Date().toISOString().slice(0, 10);
	return DailyBrowserDtos.filter((res) => isDayValidAndReadyForSubmission(res, todayDateString)).map(
		(res) => {
			const { Date: day } = res;
			const { In, Out } = res.InOuts[0];

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
		},
	);
}

function isDayValidAndReadyForSubmission(synDay: SynerionDayDTO, todayDate: string): boolean {
	return Boolean(
		synDay.Date &&
			todayDate !== synDay.Date.slice(0, 10) &&
			synDay.InOuts[0]?.In.Time &&
			synDay.InOuts[0]?.Out.Time,
	);
}
