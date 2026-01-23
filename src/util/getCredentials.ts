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
				username: process.env.HILAN_USERNAME,
				password: process.env.HILAN_PASSWORD,
			};
		case 'synerion':
			throw new IllegalArgumentError('target synerion does not require credentials');

		case 'webtime':
			return {
				username: process.env.WEBTIME_USERNAME,
				password: process.env.WEBTIME_PASSWORD,
			};
		default:
			throw new IllegalArgumentError(`unexpected target provided: ${target}`);
	}
}
