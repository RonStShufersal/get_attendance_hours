import env, { Environment } from '../env/env.schema';

// helper type for clarity
type TargetFor<T extends 'scraper' | 'automator'> = T extends 'scraper'
	? Environment['SCRAPING_TARGET']
	: Environment['AUTOMATION_TARGET'];

export function getTarget<T extends 'scraper' | 'automator'>(type: T): TargetFor<T> {
	if (type === 'scraper') {
		return env.SCRAPING_TARGET as TargetFor<T>;
	}
	return env.AUTOMATION_TARGET as TargetFor<T>;
}
