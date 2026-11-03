const allure = require('@wdio/allure-reporter').default;
const { AndroidPage } = require('../e2e/android/page/AndroidPage');
const { prepareWikipedia } = require('./command');
const { IosPage } = require('../e2e/ios/page/IosPage');
const wikipediaData = require('../fixtures/android/searches.json');
const sampleAppData = require('../fixtures/ios/text.json');

const wikipedia = new AndroidPage();
const sampleApp = new IosPage();

// Mocha hooks and reporting metadata stay out of the spec files.
function describe(title, defineTests) {
  global.describe(title, function () {
    global.beforeEach(async function () {
      const testTitle = this.currentTest.title;
      const platform = process.env.PLATFORM || 'android';
      allure.addFeature(platform === 'android' ? 'Wikipedia smoke' : 'iOS text entry');
      allure.addLabel('platform', platform);
      const testId = testTitle.match(/^\[([^\]]+)\]/)?.[1];
      if (testId) allure.addTestId(testId);
      if (platform === 'android') await prepareWikipedia(wikipedia);
    });
    defineTests();
  });
}
module.exports = { describe, test: global.it, wikipedia, sampleApp, wikipediaData, sampleAppData };
