import { TimesheetClient } from '../TimesheetClient';
import { GroupedDays } from '../types/CommonTypes';

export abstract class Automator extends TimesheetClient {
	abstract fillDays(days: GroupedDays): Promise<void>;
}
