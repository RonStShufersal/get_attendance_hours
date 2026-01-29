import { Day } from '../types/HourDay';
import { TimesheetClient } from '../TimesheetClient';

export abstract class Scraper extends TimesheetClient {
	abstract getDays(): Promise<Day[]>;
}
