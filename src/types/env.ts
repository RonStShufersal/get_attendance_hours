export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ATTENIX_USERNAME: string;
			ATTENIX_PASSWORD: string;
		}
	}
}
