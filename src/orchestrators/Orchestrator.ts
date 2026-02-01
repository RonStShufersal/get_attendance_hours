import { Environment } from '../env/env.schema';
import { getTarget } from '../util/getTarget';

export abstract class Orchestrator<
	T extends 'scraper' | 'automator',
	Target = T extends 'scraper' ? Environment['SCRAPING_TARGET'] : Environment['AUTOMATION_TARGET'],
> {
	declare protected target: Target;

	constructor(protected orchestratorType: T) {
		this.setTarget(this.getTarget(orchestratorType));
	}

	protected getTarget(orchestratorType: T): Target {
		return getTarget(orchestratorType) as Target;
	}

	protected setTarget(target: Target): void {
		this.target = target;
	}
}
