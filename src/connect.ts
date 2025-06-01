import puppeteer from 'puppeteer';
export const connect = async () => {
	try {
		return await puppeteer.launch({ headless: false });
	} catch (e) {
		console.error('Failed to launch puppeteer instance');
		throw e;
	}
};
