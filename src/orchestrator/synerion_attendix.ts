import { scrapeFromSynerion } from '../scrapers/synerion';
import { submitAttendixHours } from '../submitters/attendix';

const scrapeSynerionAndSubmitToAttendix = async () => {
	try {
		const daysPayload = await scrapeFromSynerion();
		await submitAttendixHours(daysPayload);
	} catch (e) {
		process.exit(1);
	}
};

export default scrapeSynerionAndSubmitToAttendix;
