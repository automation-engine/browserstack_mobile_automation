const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateEnvironment } = require('./environment');
const valid = { BROWSERSTACK_USERNAME: 'unit-user', BROWSERSTACK_ACCESS_KEY: 'unit-key', BROWSERSTACK_APP_ID: 'bs://unit-app', DEVICE_NAME: 'device', OS_VERSION: '17', APP_ID: 'org.wikipedia' };
test('accepts both platforms', () => {
  for (const platform of ['android', 'ios']) assert.doesNotThrow(() => validateEnvironment(valid, platform));
});
test('rejects absent credentials without revealing secret values', () => {
  assert.throws(() => validateEnvironment({ ...valid, BROWSERSTACK_ACCESS_KEY: '' }, 'android'), /BROWSERSTACK_ACCESS_KEY/);
});
test('rejects invalid platform, app reference, environment and numeric limits', () => {
  assert.throws(() => validateEnvironment(valid, 'windows'), /PLATFORM/);
  assert.throws(() => validateEnvironment({ ...valid, BROWSERSTACK_APP_ID: 'local.apk' }, 'android'), /bs:\/\//);
  assert.throws(() => validateEnvironment({ ...valid, EXECUTION_ENV: 'local' }, 'android'), /EXECUTION_ENV/);
  for (const value of ['0', '-1', 'NaN', '1.5']) assert.throws(() => validateEnvironment({ ...valid, MAX_INSTANCES: value }, 'android'), /MAX_INSTANCES/);
});
test('upload accepts credentials before an app URL exists', () => {
  assert.doesNotThrow(() => validateEnvironment({ BROWSERSTACK_USERNAME: 'unit-user', BROWSERSTACK_ACCESS_KEY: 'unit-key' }, 'ios', { credentialsOnly: true }));
});

test('Android requires a package while iOS sample can use automatic bundle detection', () => {
  assert.throws(() => validateEnvironment({ ...valid, APP_ID: '' }, 'android'), /APP_ID/);
  assert.doesNotThrow(() => validateEnvironment({ ...valid, APP_ID: '' }, 'ios'));
});
