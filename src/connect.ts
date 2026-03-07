import puppeteer from 'puppeteer';
export const connect = async () => {
	try {
		return await puppeteer.launch({
			args: [
				// docker args
				'--no-sandbox',
				'--disable-dev-shm-usage',
			],
		});
	} catch (e) {
		console.error('Failed to launch puppeteer instance');
		throw e;
	}
};
