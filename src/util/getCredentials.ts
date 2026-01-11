import illegalArgumentError from '../errors/IllegalArgumentsError';
import { Target } from '../types/targets';

export function getCredentials(target: Target): {
	username: string | undefined;
	password: string | undefined;
} {
	switch (target) {
		case 'hilan':
			return {
				username: process.env.HILAN_USERNAME,
				password: process.env.HILAN_PASSWORD,
			};
		case 'synerion':
			return illegalArgumentError('target synerion does not require credentials');

		case 'webtime':
			return {
				username: process.env.WEBTIME_USERNAME,
				password: process.env.WEBTIME_PASSWORD,
			};
		default:
			return illegalArgumentError(`unexpected target provided: ${target}`);
	}
}
