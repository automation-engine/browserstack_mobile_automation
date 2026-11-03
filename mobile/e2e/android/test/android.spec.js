const { describe, test, wikipedia, wikipediaData } = require('../../../support/customTest');

describe('Wikipedia native mobile smoke', () => {
  test('[WIKI-001] launches the Wikipedia application', async () => {
    await wikipedia.verifyApplicationIsRunning();
  });

  test('[WIKI-002] displays the home search entry', async () => {
    await wikipedia.verifyHomeScreen();
  });

  for (const scenario of wikipediaData.searches) {
    test('[' + scenario.id + '] searches and validates ' + scenario.term, async () => {
      await wikipedia.search(scenario.term);
      await wikipedia.verifySearchResults(scenario.expectedTitle);
    });
  }
});
