import { Environment } from './src/env/env.schema';

declare global {
	declare namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		export interface ProcessEnv extends Environment {}
	}
}
