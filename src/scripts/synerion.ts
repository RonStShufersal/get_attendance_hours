// import path from 'path';
import { HTTPResponse, Page } from 'puppeteer';
import { connect } from '../connect';
// import scrapeError from '../errors/ScrapingError';
import { Day, Hour } from '../types/hours';
import { SynerionResponse } from '../types/synerion';
import { writeFile } from 'node:fs/promises';
import { stringIsHourBase } from '../util/typeChecks';
import scrapeError from '../errors/ScrapingError';
import formAutomationError from '../errors/FormAutomationError';
import fillInput from '../util/fillInput';
// const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const URL = 'https://lavieweb.corp.supersol.co.il/synerionweb/#/dailyBrowser';
const externalNetworkRequestURL = `https://lavieweb.corp.supersol.co.il/SynerionWeb/api/DailyBrowser/Attendance`;
const attentixLogin = `https://webtime.taldor.co.il/?msg=login&ret=wt_periodic.adp`;
let username = process.env.ATTENTIX_USERNAME || '';
let password = process.env.ATTENTIX_PASSWORD || '';
export const run = async () => {
  username = process.env.ATTENTIX_USERNAME || '';
  password = process.env.ATTENTIX_PASSWORD || '';

  if (!username || !password) {
    throw new Error('please provide both a username and a password');
  }
  const browser = await connect();
  const page = await browser.newPage();
  let hoursWithDay = [] as Day[];
  const eventHandler = async (response: HTTPResponse) => {
    if (response.url() !== externalNetworkRequestURL || !response.ok) {
      return;
    }
    const body = await response.json();
    hoursWithDay = getDaysAndHoursFromSynerionResponse(body);
  };
  page.on('response', eventHandler);
  await page.setViewport({ width: 1280, height: 1800 });
  await page.goto(URL, { waitUntil: 'networkidle2' });

  await page.goto(attentixLogin, { waitUntil: 'networkidle2' });
  page.off('response', eventHandler);
  await fillOutLoginDetailsAndLogin(page);
  await saveAttentixHoursAndModifyRequest(page, hoursWithDay);

  await browser.close();
};

function getDaysAndHoursFromSynerionResponse(response: SynerionResponse): Day[] {
  return response.DailyBrowserDtos.filter(
    res =>
      res.Date &&
      new Date().toISOString().slice(0, 10) !== res.Date.slice(0, 10) &&
      res.InOuts[0].In?.Time &&
      res.InOuts[0]?.Out.Time,
  ).map(res => {
    const { Date: day } = res;
    const { In, Out } = res.InOuts[0];

    if (!stringIsHourBase(In.Time) || !stringIsHourBase(Out.Time)) {
      scrapeError(`${In.Time}, ${Out.Time}`);
    }
    const inTime: Hour = In.Time;
    const outTime: Hour = Out.Time;
    return {
      dayValue: day as Day['dayValue'],
      hours: {
        in: inTime,
        out: outTime,
      },
    };
  });
}

async function fillOutLoginDetailsAndLogin(page: Page) {
  const inputs: Parameters<typeof fillInput>[0][] = [
    { inputSelector: 'email', inputValue: username, errorMsg: 'couldnt find attentix email input' },
    { inputSelector: 'password', inputValue: password, errorMsg: 'couldnt find attentix password input' },
  ].map(p => ({ ...p, page }));

  Promise.all(inputs)

  const submitButton = await page.$('#image1');

  if (submitButton === null) {
    formAutomationError('couldnt find submit button');
  }

  await submitButton.click();

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  return;
}

async function saveAttentixHoursAndModifyRequest(page: Page, days: Day[]) {
  const button = await page.$('#save_btn');

  console.log(days);

  if (!button) {
    throw new Error('couldnt find save button');
  }

  await page.setRequestInterception(true);

  page.on('request', async interceptedRequest => {
    if (interceptedRequest.isInterceptResolutionHandled()) return;

    const allData = interceptedRequest.postData();
    if (allData) {
      await writeFile('./attendix_formData_payload.txt', allData);
      const formDataObject = allData.split('&').reduce((p, c) => {
        const [key, value] = c.split('=');
        p[key] = value;
        return p;
      }, {} as Record<string, string>);

      await writeFile('./attendix_payload.json', JSON.stringify(formDataObject, null, 2));

      interceptedRequest.continue();

      // for (const key in formDataObject) {

      //   if (Object.prototype.hasOwnProperty.call(formDataObject, key)) {
      //     const element = formDataObject[key];
      //   }
      // }
    }
  });

  await button.click();

  await page.waitForNetworkIdle({ idleTime: 1000 });
}
