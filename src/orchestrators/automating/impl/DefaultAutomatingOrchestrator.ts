import { Automator } from '../../../clients/automators/Automator';
import { WebtimeAutomator } from '../../../clients/automators/impl/WebtimeAutomator';
import { GroupedDays } from '../../../clients/types/CommonTypes';
import { AutomatingOrchestrator } from '../AutomatingOrchestrator';

export class DefaultAutomatingOrchestrator extends AutomatingOrchestrator {
	constructor() {
		super('automator');
	}

	async orchestrateDayAutomation(days: GroupedDays): Promise<void> {
		let automator: Automator;
		const target = this.target;
		switch (target) {
			case 'webtime':
				automator = new WebtimeAutomator();
				break;

			default:
				console.error(`automation target ${target} not recognized, exiting`);
				process.exit(1);
		}

		await automator.fillDays(days);
	}
}
