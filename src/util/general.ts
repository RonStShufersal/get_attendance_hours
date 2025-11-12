import illegalArgumentError from '../errors/IllegalArgumentsError';

export function isBetweenRange(start?: number | Date, end?: number | Date, value?: number | Date) {
	start = dateOrString2Number(start);
	end = dateOrString2Number(end);
	value = dateOrString2Number(value);

	if (typeof start !== 'number' || typeof end !== 'number' || typeof value !== 'number') {
		illegalArgumentError(
			`cannot check against one of these values: ${JSON.stringify({ start, end, value })}`,
		);
	}

	return start <= value && end >= value;
}

export function dateOrString2Number(value?: number | Date | string): number {
	if (value instanceof Date) {
		return value.getTime();
	}
	if (typeof value === 'string') {
		return Number(value);
	}
	if (typeof value === 'number') {
		return value;
	}
	illegalArgumentError(`unexpected type given as argument: ${value}`);
}
