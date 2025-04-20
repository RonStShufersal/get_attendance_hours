import scrapeSynerionAndSubmitToAttenix from '@/orchestrators/synerion_attenix';
import dotenv from 'dotenv';

dotenv.configDotenv();

const script = process.env.INITIAL_SCRIPT

console.log(`selected script: ${script}`);

switch (script) {
	case 'synerion.attenix':
		scrapeSynerionAndSubmitToAttenix();
		break;
	case undefined:
		console.error('Environment variable INITIAL_SCRIPT was not provided, exiting early');
		process.exit(1);
	default:
		console.error('Environment variable INITIAL_SCRIPT script not recognized, exiting early');
		process.exit(1);
}

