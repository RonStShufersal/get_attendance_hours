import { GroupedDays } from '../../clients/types/CommonTypes';
import { Orchestrator } from '../Orchestrator';

export abstract class AutomatingOrchestrator extends Orchestrator {
	abstract orchestrateDayAutomation(days: GroupedDays): Promise<void>;
}
