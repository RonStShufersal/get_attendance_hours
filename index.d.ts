declare namespace NodeJS {
	export interface ProcessEnv {
		SCRAPING_TARGET?: 'synerion' | 'hilan';
		AUTOMATION_TARGET?: 'webtime';

		AUTOMATOR_USERNAME?: string;
		AUTOMATOR_PASSWORD?: string;

		SCRAPER_USERNAME?: string;
		SCRAPER_PASSWORD?: string;
	}
}
