import { Browser, HTTPResponse, Page } from 'puppeteer';
import { setViewAndGoto } from '.';

export default async function setupPage(
	url: string,
	browser: Browser,
	eventHandler?: (response: HTTPResponse) => Promise<void>,
): Promise<Page> {
	const page = await browser.newPage();
	if (eventHandler) {
		page.on('response', eventHandler);
	}
	await setViewAndGoto(url, page);

	if (eventHandler) {
		page.off('response', eventHandler);
	}
	return page;
}
