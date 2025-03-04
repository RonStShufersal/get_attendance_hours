import puppeteer from 'puppeteer';
export const connect = async () => {
  try {
    return await puppeteer.launch({headless:false});
  } catch (e) {
    console.error('Failed to connect to docker container, is it running?');
    throw e;
  }
};
