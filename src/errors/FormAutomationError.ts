export class FormAutomationError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'FormAutomation';
	}
}
export default function formAutomationError(message?: string): never {
	throw new FormAutomationError(message ?? 'failed to automate form filling');
}
