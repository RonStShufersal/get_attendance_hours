export enum SelectorLookupStrategy {
	BY_ID,
	BY_INPUT_NAME,
}

export interface LoginInputStrategy {
	inputSelector: {
		rawSelector: string;
		lookupStrategy: SelectorLookupStrategy;
	};
	inputValue: string | number | Date;
	errorMsg?: string;
}
