const platforms = require('./platforms');
function createCapabilities(env) {
  const platform = platforms[env.platform];
  return {
    platformName: platform.platformName,
    'appium:automationName': platform.automationName,
    'appium:app': env.BROWSERSTACK_APP_ID,
    'appium:noReset': false,
    'appium:language': 'en',
    'appium:locale': env.platform === 'android' ? 'US' : 'en_US',
    ...(env.platform === 'android' ? {
      ...(env.APP_ID ? { 'appium:appPackage': env.APP_ID } : {}),
      'appium:autoGrantPermissions': true,
    } : (env.APP_ID ? { 'appium:bundleId': env.APP_ID } : {})),
    'bstack:options': {
      deviceName: env.DEVICE_NAME,
      osVersion: env.OS_VERSION,
      projectName: env.PROJECT_NAME || 'Wikipedia Mobile POC',
      buildName: (env.BUILD_NAME || 'Wikipedia POC') + ' - ' + new Date().toISOString().slice(0, 10),
      sessionName: env.platform === 'android' ? 'Wikipedia Android smoke' : 'Sample app iOS text smoke',
      debug: true,
      video: true,
      appiumVersion: env.APPIUM_VERSION || '3.5.2',
    },
  };
}
module.exports = { createCapabilities };

