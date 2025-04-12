import { scrapeFromSynerion } from '../scrapers/synerion';
import { submitAttendixHours } from '../submitters/attendix';

export default async function scrapeSynerionAndSubmitToAttendix() {
	try {
		const daysPayload = await scrapeFromSynerion();
		await submitAttendixHours(daysPayload);
	} catch (e) {
		process.exit(1);
	}
}
