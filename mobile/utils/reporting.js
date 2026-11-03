const fs = require('node:fs/promises');
const path = require('node:path');
const allure = require('@wdio/allure-reporter').default;
const logger = require('./logger');

async function captureFailure(driver, title) {
  try {
    const screenshot = await driver.takeScreenshot();
    const directory = path.resolve(__dirname, '../../reports/screenshots');
    await fs.mkdir(directory, { recursive: true });
    const name = title.replace(/[^a-z0-9]+/gi, '_').slice(0, 100);
    await fs.writeFile(path.join(directory, name + '-' + driver.sessionId + '-' + Date.now() + '.png'), screenshot, 'base64');
    allure.addAttachment('Failure screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
  } catch (error) {
    logger.warn('Unable to capture failure screenshot: ' + error.message);
  }
}
async function reportSession(driver, result) {
  await driver.execute('browserstack_executor: ' + JSON.stringify({
    action: 'setSessionStatus',
    arguments: { status: result === 0 ? 'passed' : 'failed', reason: result === 0 ? 'All mobile smoke tests passed' : 'Test or hook failed; see Allure report' },
  }));
  logger.info('BrowserStack session: ' + driver.sessionId);
}
module.exports = { captureFailure, reportSession };
