const { loadEnvironment } = require('../../config/environment');
try {
  const env = loadEnvironment();
  console.log('Valid configuration: ' + env.platform + ' / ' + env.EXECUTION_ENV + ' / ' + env.DEVICE_NAME + ' / ' + env.OS_VERSION);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
