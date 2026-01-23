import { Page } from 'puppeteer';
import { LoginInputStrategy } from '../types/LoginInputStrategy';

export interface LoginStrategy {
	page: Page;
	expectedInputs: LoginInputStrategy[];
	loginUrl: string;
	handleLoginInputs(): Promise<void>;
}
