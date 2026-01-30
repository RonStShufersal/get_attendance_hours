import { Target } from '../types/targets';

export function getTarget(type: 'scraper' | 'automator'): Target {
	switch (type) {
		case 'scraper':
			return process.env.SCRAPING_TARGET;

		case 'automator':
			return process.env.AUTOMATION_TARGET;

		default:
			return;
	}
}
