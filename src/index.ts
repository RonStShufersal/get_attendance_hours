import dotenv from 'dotenv';
import { main } from './main';

dotenv.configDotenv();

main()
	.then(() => {
		console.log('All tasks completed successfully.');
		process.exit(0);
	})
	.catch((error) => {
		console.error('An error occurred:', error);
		process.exit(1);
	});
