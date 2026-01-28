import { automateWebtimeHoursEntry } from '../../../clients/automators/webtime';
import { GroupedDays } from '../../../clients/types/CommonTypes';
import { AutomatingOrchestrator } from '../AutomatingOrchestrator';

export class DefaultAutomatingOrchestrator extends AutomatingOrchestrator {
	constructor() {
		super('automator');
	}

	async orchestrateDayAutomation(days: GroupedDays): Promise<void> {
		const target = this.target;
		switch (target) {
			case 'webtime':
				await automateWebtimeHoursEntry(days);
				break;

			default:
				console.error('automating target not recognized, exiting');
				process.exit(1);
		}
	}
}
