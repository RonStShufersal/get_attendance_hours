export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ATTENDIX_USERNAME: string;
			ATTENTIX_PASSWORD: string;
		}
	}
}
