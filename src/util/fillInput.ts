import { Page } from 'puppeteer';
import formAutomationError from '../errors/FormAutomationError';

export default async function fillInput({
  page,
  inputSelector,
  inputValue,
  errorMsg,
}: {
  page: Page;
  inputSelector: string;
  inputValue: string;
  errorMsg?: string;
}) {
  const input = await page.$(`input[name="${inputSelector}"]`);
  if (input === null) {
    formAutomationError(errorMsg || 'couldnt find input');
  }

  await input.type(inputValue);
}
