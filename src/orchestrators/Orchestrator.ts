import { Target } from '../types/targets';
import { getTarget } from '../util/getTarget';

export abstract class Orchestrator {
	protected target: Target;

	constructor(protected orchestratorType: 'scraper' | 'automator') {
		this.setTarget(this.getTarget(orchestratorType));
	}

	protected getTarget(orchestratorType: 'scraper' | 'automator'): Target {
		return getTarget(orchestratorType);
	}

	protected setTarget(target: Target): void {
		this.target = target;
	}
}
