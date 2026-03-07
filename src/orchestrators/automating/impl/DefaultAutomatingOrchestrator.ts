import { Automator } from '../../../clients/automators/Automator';
import { WebtimeAutomator, WebtimeAutomatorConfig } from '../../../clients/automators/impl/WebtimeAutomator';
import { GroupedDays } from '../../../clients/types/CommonTypes';
import { unsupportedTargetError } from '../../../errors/UnsupportedError';
import { AutomatingOrchestrator } from '../AutomatingOrchestrator';

export class DefaultAutomatingOrchestrator extends AutomatingOrchestrator {
	// TODO this will be problematic once new targets are added
	// it enforces webtime's config on other targets
	// possible solutions include generating a config per all target combinations
	constructor(private readonly config: WebtimeAutomatorConfig) {
		super('automator');
	}

	async orchestrateDayAutomation(days: GroupedDays): Promise<void> {
		let automator: Automator;
		const target = this.target;
		switch (target) {
			case 'webtime':
				automator = new WebtimeAutomator(this.config);
				break;

			default:
				console.error(`automation target ${target} not recognized`);
				unsupportedTargetError();
		}

		await automator.fillDays(days);
	}
}
