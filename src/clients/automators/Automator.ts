import { Day } from '../types/HourDay';
import { TimesheetClient } from '../TimesheetClient';

export abstract class Automator extends TimesheetClient {
	abstract fillDays(days: Day[]): Promise<void>;
}
