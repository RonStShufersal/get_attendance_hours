import { IllegalArgumentError } from '../errors/IllegalArgumentsError';
import { Credentials } from '../types/credentials';
import { Target } from '../types/targets';

/**
 *
 * @param {Target} target your intended target
 * @returns {Credentials}
 * @throws { IllegalArgumentError }
 */
export function getCredentials(target: Target): Credentials | never {
	switch (target) {
		case 'hilan':
			return {
				username: process.env.SCRAPER_USERNAME,
				password: process.env.SCRAPER_PASSWORD,
			};
		case 'synerion':
			throw new IllegalArgumentError('target synerion does not require credentials');

		case 'webtime':
			return {
				username: process.env.AUTOMATOR_USERNAME,
				password: process.env.AUTOMATOR_PASSWORD,
			};
		default:
			throw new IllegalArgumentError(`unexpected target provided: ${target}`);
	}
}
