const { browser, expect } = require('@wdio/globals');
const commands = require('../../../support/command');
const locators = require('../locator/IosLocators');

class IosPage {
  constructor(driver = browser) {
    this.driver = driver;
  }
  async verifyHomeScreen() {
    await commands.verifyVisible(locators.textButton, this.driver);
  }
  async enterAndVerifyText(value) {
    return commands.step('Enter text and verify the displayed output', async () => {
      await commands.click(locators.textButton, this.driver);
      const input = await commands.element(locators.textInput, this.driver);
      await input.click();
      await input.setValue(value + '\n');
      await expect(await this.driver.$(locators.textOutput)).toHaveText(value);
    });
  }
}
module.exports = { IosPage };
