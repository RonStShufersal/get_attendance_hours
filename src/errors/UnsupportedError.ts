export class UnsupportedTargetError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'UnsupportedTarget';
	}
}
export function unsupportedTargetError(message?: string): never {
	throw new UnsupportedTargetError(message ?? 'current target is not supported');
}

export class UnsupportedConfigError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'UnsupportedConfig';
	}
}
