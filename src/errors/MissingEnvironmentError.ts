export class MissingEnvironmentError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'MissingEnvironmentError';
	}
}

export default function missingEnvironmentError(message?: string): never {
	throw new MissingEnvironmentError(message);
}
