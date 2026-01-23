export class MissingCredentialsError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'IllegalArgument';
	}
}
export default function missingCredentialsError(message?: string): never {
	throw new MissingCredentialsError(message ?? 'missing credentials');
}
