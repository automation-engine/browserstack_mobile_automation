const { browser, expect } = require('@wdio/globals');
const logger = require('../utils/logger');

async function element(selector, driver = browser) {
  const target = await driver.$(selector);
  await target.waitForDisplayed();
  return target;
}
async function click(selector, driver = browser) {
  const target = await element(selector, driver);
  await target.waitForEnabled();
  await target.click();
}
async function fill(selector, value, driver = browser) {
  const target = await element(selector, driver);
  await target.waitForEnabled();
  await target.setValue(value);
}
async function verifyVisible(selector, driver = browser) {
  await expect(await driver.$(selector)).toBeDisplayed();
}
async function step(name, action) {
  logger.info(name);
  try {
    return await action();
  } catch (error) {
    throw new Error(name + ': ' + error.message, { cause: error });
  }
}
async function restartApp(appId, driver = browser) {
  await driver.terminateApp(appId);
  await driver.activateApp(appId);
}
async function verifyAppRunning(appId, driver = browser) {
  expect(await driver.queryAppState(appId)).toBe(4);
}
async function prepareWikipedia(page) {
  return step('Launch Wikipedia and finish optional onboarding', async () => {
    const { driver, locators } = page;
    await restartApp(process.env.APP_ID, driver);
    await driver.waitUntil(async () => {
      if (await (await driver.$(locators.legacyCompatibilityMessage)).isDisplayed()) {
        await click(locators.legacyCompatibilityConfirm, driver);
      }
      if (await (await driver.$(locators.searchInput)).isDisplayed()) await driver.back();
      if (await (await driver.$(locators.home)).isDisplayed()) return true;
      const skip = await driver.$(locators.skipOnboarding);
      if (await skip.isDisplayed()) await skip.click();
      return (await driver.$(locators.home)).isDisplayed();
    }, { timeoutMsg: 'Wikipedia home did not appear; inspect onboarding and platform locators' });
  });
}

module.exports = { element, click, fill, verifyVisible, step, restartApp, verifyAppRunning, prepareWikipedia };
