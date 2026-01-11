declare namespace NodeJS {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface ProcessEnv {
		// TODO Add all expected env variables
		SCRAPING_TARGET?: 'synerion'|'hilan';
		AUTOMATION_TARGET?: 'webtime';

		WEBTIME_USERNAME?: string;
		WEBTIME_PASSWORD?: string;

		HILAN_USERNAME?: string;
		HILAN_PASSWORD?: string
	}
}
