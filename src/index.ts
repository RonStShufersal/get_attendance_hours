import { main } from './main';

main()
	.then(() => {
		console.log('All tasks completed successfully.');
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
