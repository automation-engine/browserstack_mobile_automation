const fs = require('node:fs');
const path = require('node:path');
const { openAsBlob } = require('node:fs');
const { loadEnvironment } = require('../../config/environment');
const logger = require('./logger');

async function main() {
  const env = loadEnvironment({ credentialsOnly: true });
  const appPath = path.resolve(env.root, process.argv[2] || env.APP_PATH || '');
  const extension = env.platform === 'android' ? '.apk' : '.ipa';
  if (path.extname(appPath).toLowerCase() !== extension || !fs.existsSync(appPath)) {
    throw new Error('Provide an existing ' + extension + ' path: npm run upload:' + env.platform + ' -- path/to/app' + extension);
  }
  const form = new FormData();
  form.append('file', await openAsBlob(appPath), path.basename(appPath));
  const response = await fetch('https://api-cloud.browserstack.com/app-automate/upload', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(env.BROWSERSTACK_USERNAME + ':' + env.BROWSERSTACK_ACCESS_KEY).toString('base64') },
    body: form,
    signal: AbortSignal.timeout(300000),
  });
  if (!response.ok) throw new Error('BrowserStack upload failed: HTTP ' + response.status);
  const body = await response.json();
  if (!body.app_url?.startsWith('bs://')) throw new Error('Upload response did not contain app_url');
  const envFile = path.join(env.root, '.env.' + env.platform);
  let content = fs.readFileSync(envFile, 'utf8');
  const pattern = /^BROWSERSTACK_APP_ID=.*$/m;
  content = pattern.test(content) ? content.replace(pattern, 'BROWSERSTACK_APP_ID=' + body.app_url) : content + '\nBROWSERSTACK_APP_ID=' + body.app_url + '\n';
  fs.writeFileSync(envFile, content);
  console.log('Uploaded app and saved BROWSERSTACK_APP_ID in .env.' + env.platform);
}
main().catch((error) => { logger.warn(error.message); process.exitCode = 1; });


