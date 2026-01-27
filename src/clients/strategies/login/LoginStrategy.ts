export interface LoginStrategy {
	handleLoginInputs(): Promise<void>;
}
