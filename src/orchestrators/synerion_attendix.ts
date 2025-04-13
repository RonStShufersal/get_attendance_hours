import formAutomationError from '@/errors/FormAutomationError';
import { scrapeFromSynerion } from '@/scrapers/synerion';
import { submitAttendixHours } from '@/submitters/attendix';
import { AUTOMATION_RESULT_CODE } from '@/types/codes';

export default async function scrapeSynerionAndSubmitToAttendix() {
	try {
		const daysPayload = await scrapeFromSynerion();
		if (daysPayload === AUTOMATION_RESULT_CODE.ERROR) {
			formAutomationError('scraping synerion failed');
		}
		const result = await submitAttendixHours(daysPayload);
		if (result === AUTOMATION_RESULT_CODE.ERROR) {
			formAutomationError('failed to submit to attendix');
		}
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
}
