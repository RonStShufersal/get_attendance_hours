import { Day } from '../../clients/types/HourDay';
import { Orchestrator } from '../Orchestrator';

export abstract class ScrapingOrchestrator extends Orchestrator<'scraper'> {
	abstract orchestrateDayScraping(): Promise<Day[]>;
}
