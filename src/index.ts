import { run as synerionRun } from './scripts/synerion';
import dotenv from 'dotenv';

dotenv.configDotenv();

switch (process.env.SCRIPT) {
  case 'synerion':
    synerionRun();
    break;
  default:
    console.error('No script specified or script not recognized.');
    process.exit(1);
}
