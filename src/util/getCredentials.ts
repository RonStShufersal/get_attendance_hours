import env, { EnvTargets } from '../env/env.schema';
import { IllegalArgumentError } from '../errors/IllegalArgumentsError';
import { Credentials } from '../types/credentials';

/**
 * @param {Target} target your intended target
 * @returns {Credentials}
 * @throws { IllegalArgumentError }
 */
export function getCredentials(target: EnvTargets): Credentials | never {
	switch (target) {
		case 'hilan':
			return {
				username: env.SCRAPER_USERNAME,
				password: env.SCRAPER_PASSWORD,
			};
		case 'synerion':
			throw new IllegalArgumentError('target synerion does not require credentials');

		case 'webtime':
			return {
				username: env.AUTOMATOR_USERNAME,
				password: env.AUTOMATOR_PASSWORD,
			};
		default:
			throw new IllegalArgumentError(`unexpected target provided: ${target}`);
	}
}
