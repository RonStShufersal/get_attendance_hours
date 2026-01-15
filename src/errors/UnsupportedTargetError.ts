export class UnsupportedTargetError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'IllegalArgument';
	}
}
export default function unsupportedTargetError(message?: string): never {
	throw new UnsupportedTargetError(message ?? 'current target is not supported');
}
