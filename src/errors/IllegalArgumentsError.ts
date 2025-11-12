export class IllegalArgumentError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'IllegalArgument';
	}
}
export default function illegalArgumentError(message?: string): never {
	throw new IllegalArgumentError(message);
}
