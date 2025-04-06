import { run as synerionRun } from './scripts/synerion';
import dotenv from 'dotenv';

dotenv.configDotenv();

switch (process.env.INITIAL_SCRIPT) {
	case 'synerion':
		synerionRun();
		break;
	case undefined:
		console.error(
			'Environment variable INITIAL_SCRIPT was not provided, exiting early',
		);
		process.exit(1);
    break;
	default:
		console.error('script not recognized, exiting early');
		process.exit(1);
}

console.log('selected script:', process.env.INITIAL_SCRIPT);
