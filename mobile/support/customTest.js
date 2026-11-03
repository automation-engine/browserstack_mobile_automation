const allure = require('@wdio/allure-reporter').default;
const { WikipediaPage } = require('../e2e/wikipedia/pages/android/WikipediaPage');
const { prepareWikipedia } = require('./command');
const { SampleAppPage } = require('../e2e/sampleApp/pages/ios/SampleAppPage');
const wikipediaData = require('../fixtures/wikipedia/searches.json');
const sampleAppData = require('../fixtures/sampleApp/text.json');

const wikipedia = new WikipediaPage();
const sampleApp = new SampleAppPage();

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
