const { browser, expect } = require('@wdio/globals');
const commands = require('../../../../support/command');
const createLocators = require('../../locators/android/WikipediaLocators');

class WikipediaPage {
  constructor(driver = browser) {
    this.driver = driver;
    this.locators = createLocators(process.env.APP_ID);
  }
  async verifyApplicationIsRunning() {
    await commands.verifyAppRunning(process.env.APP_ID, this.driver);
  }
  async verifyHomeScreen() {
    return commands.step('Verify Wikipedia home screen', () => commands.verifyVisible(this.locators.home, this.driver));
  }
  async search(term) {
    return commands.step('Search Wikipedia for ' + term, async () => {
      await commands.click(this.locators.searchEntry, this.driver);
      await commands.fill(this.locators.searchInput, term, this.driver);
      await expect(await this.driver.$(this.locators.searchInput)).toHaveAttribute('text', term);
    });
  }
  async verifySearchResults(expectedTitle) {
    return commands.step('Verify search contains article ' + expectedTitle, async () => {
      await this.driver.waitUntil(async () => {
        const titles = await this.driver.$$(this.locators.resultTitles);
        for (const title of titles) {
          if (await title.isDisplayed() && (await title.getText()).trim().toLowerCase() === expectedTitle.toLowerCase()) return true;
        }
        return false;
      }, { timeoutMsg: 'Expected article title not found in Wikipedia search: ' + expectedTitle });
    });
  }
}
module.exports = { WikipediaPage };
