const { browser } = require('@wdio/globals');
const { loadEnvironment } = require('./config/environment');
const { createCapabilities } = require('./config/browserstack');
const { captureFailure, reportSession } = require('./mobile/utils/reporting');
const env = loadEnvironment();
exports.config = {
  runner: 'local',
  specs: ['./mobile/e2e/' + env.platform + '/test' + '/**/*.spec.js'],
  maxInstances: Number(env.MAX_INSTANCES || 1),
  user: env.BROWSERSTACK_USERNAME,
  key: env.BROWSERSTACK_ACCESS_KEY,
  protocol: 'https',
  hostname: 'hub-cloud.browserstack.com',
  port: 443,
  path: '/wd/hub',
  capabilities: [createCapabilities(env)],
  logLevel: 'warn',
  outputDir: './logs',
  waitforTimeout: Number(env.WAIT_TIMEOUT || 20000),
  waitforInterval: 500,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 1,
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 120000, retries: 0 },
  reporters: [
    'spec',
    ['allure', { outputDir: 'reports/allure-results', disableWebdriverStepsReporting: true, disableWebdriverScreenshotsReporting: true }],
    ['junit', { outputDir: 'reports/junit', outputFileFormat: ({ cid }) => 'results-' + env.platform + '-' + cid + '.xml' }],
  ],
  async afterTest(test, context, { passed }) {
    if (!passed) await captureFailure(browser, test.title);
  },
  async afterHook(test, context, { error }) {
    if (error) await captureFailure(browser, test.title || 'Hook failure');
  },
  async after(result) {
    await reportSession(browser, result);
  },
};

