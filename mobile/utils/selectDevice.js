const fs = require('node:fs');
const path = require('node:path');
const { loadEnvironment } = require('../../config/environment');
const { randomInt } = require('node:crypto');
async function main() {
  const env = loadEnvironment({ credentialsOnly: true });
  const response = await fetch('https://api-cloud.browserstack.com/app-automate/devices.json', {
    headers: { Authorization: 'Basic ' + Buffer.from(env.BROWSERSTACK_USERNAME + ':' + env.BROWSERSTACK_ACCESS_KEY).toString('base64') },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error('Device discovery failed: HTTP ' + response.status + '. Use your automation username and access key, not website login credentials.');
  const devices = await response.json();
  const minimumOs = env.platform === 'ios' ? 16 : 8; // Supported by the default cloud Appium 3.5.2 image.
  const candidates = devices.filter(device => String(device.os).toLowerCase() === env.platform && (device.real_mobile === true || device.realMobile === true) && Number.parseFloat(device.os_version) >= minimumOs);
  if (!candidates.length) throw new Error('No real devices available for ' + env.platform);
  const selected = candidates[randomInt(candidates.length)];
  const file = path.join(env.root, '.env.' + env.platform);
  let content = fs.readFileSync(file, 'utf8');
  for (const [key, value] of Object.entries({ DEVICE_NAME: selected.device, OS_VERSION: selected.os_version })) {
    const pattern = new RegExp('^' + key + '=.*$', 'm');
    content = pattern.test(content) ? content.replace(pattern, key + '=' + value) : content + '\n' + key + '=' + value + '\n';
  }
  fs.writeFileSync(file, content);
  console.log('Selected ' + env.platform + ': ' + selected.device + ' / ' + selected.os_version);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });


