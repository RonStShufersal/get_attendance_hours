import dotenv from 'dotenv';
import { main } from './main';

dotenv.configDotenv();

main()
	.then(() => {
		console.log('All tasks completed successfully.');
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
