export enum SelectorLookupStrategy {
	BY_ID = 'byId',
	BY_INPUT_NAME = 'byInputName',
}

export interface LoginInputStrategy {
	inputSelector: {
		rawSelector: string;
		lookupStrategy: SelectorLookupStrategy;
	};
	inputValue: string | number | Date;
	errorMsg?: string;
}
