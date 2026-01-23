declare namespace NodeJS {
	export interface ProcessEnv {
		SCRAPING_TARGET?: 'synerion' | 'hilan';
		AUTOMATION_TARGET?: 'webtime';

		WEBTIME_USERNAME?: string;
		WEBTIME_PASSWORD?: string;

		HILAN_USERNAME?: string;
		HILAN_PASSWORD?: string;
	}
}
