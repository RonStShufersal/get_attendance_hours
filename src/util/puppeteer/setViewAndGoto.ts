import { Page, PuppeteerLifeCycleEvent, Viewport } from 'puppeteer';

const setViewAndGoto = async (
	url: string,
	page: Page,
	options?: { viewport: Viewport; waitUntil: PuppeteerLifeCycleEvent },
) => {
	const viewport = options?.viewport ?? { width: 1920, height: 1280 };
	const waitUntil = options?.waitUntil ?? 'networkidle2';
	await page.setViewport(viewport);
	await page.goto(url, { waitUntil });
};

export default setViewAndGoto;
