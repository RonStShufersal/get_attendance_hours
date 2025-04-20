import formAutomationError from '@/errors/FormAutomationError';
import { scrapeFromSynerion } from '@/scrapers/synerion';
import { submitAttenixHours } from '@/submitters/attenix';
import { AUTOMATION_RESULT_CODE } from '@/types/codes';

export default async function scrapeSynerionAndSubmitToAttenix() {
	try {
		const daysPayload = await scrapeFromSynerion();
		if (daysPayload === AUTOMATION_RESULT_CODE.ERROR) {
			formAutomationError('scraping synerion failed');
		}
		const result = await submitAttenixHours(daysPayload);
		if (result === AUTOMATION_RESULT_CODE.ERROR) {
			formAutomationError('failed to submit to attenix');
		}
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
}
