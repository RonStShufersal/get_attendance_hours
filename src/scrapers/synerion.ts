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
