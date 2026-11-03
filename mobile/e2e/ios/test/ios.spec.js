const { describe, test, sampleApp, sampleAppData } = require('../../../support/customTest');

describe('BrowserStack iOS sample app smoke', () => {
  test('[IOS-001] opens the text screen and displays entered text', async () => {
    await sampleApp.verifyHomeScreen();
    await sampleApp.enterAndVerifyText(sampleAppData.text);
  });
});
