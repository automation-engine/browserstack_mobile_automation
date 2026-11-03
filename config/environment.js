const path = require('node:path');


const root = path.resolve(__dirname, '..');
function validateEnvironment(env, platform, { credentialsOnly = false } = {}) {
  if (!['android', 'ios'].includes(platform)) throw new Error('PLATFORM must be android or ios');
  const required = credentialsOnly
    ? ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']
    : ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_APP_ID', 'DEVICE_NAME', 'OS_VERSION'];
  if (!credentialsOnly && platform === 'android') required.push('APP_ID');
  const missing = required.filter((key) => !env[key]?.trim() || /^(your_|<|replace_)/i.test(env[key]));
  if (missing.length) throw new Error('Configure these variables in .env.' + platform + ' or process environment: ' + missing.join(', '));
  if (!credentialsOnly && !/^bs:\/\/[^\s]+$/.test(env.BROWSERSTACK_APP_ID)) throw new Error('BROWSERSTACK_APP_ID must be the bs:// URL returned by app upload');
  if (env.EXECUTION_ENV && env.EXECUTION_ENV !== 'browserstack') throw new Error('EXECUTION_ENV must be browserstack');
  for (const key of ['WAIT_TIMEOUT', 'MAX_INSTANCES']) {
    if (env[key] && (!/^\d+$/.test(env[key]) || Number(env[key]) < 1)) throw new Error(key + ' must be a positive integer');
  }
}
function loadEnvironment(options = {}) {
  const platform = process.env.PLATFORM || 'android';
  if (!['android', 'ios'].includes(platform)) throw new Error('PLATFORM must be android or ios');
  require('dotenv').config({ path: path.join(root, '.env.' + platform), override: false, quiet: true });
  const defaults = platform === 'android' ? require('./android.defaults.json') : {};
  for (const [key, value] of Object.entries(defaults)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  const env = { ...process.env };
  validateEnvironment(env, platform, options);
  return { ...env, platform, root };
}
module.exports = { loadEnvironment, validateEnvironment };


