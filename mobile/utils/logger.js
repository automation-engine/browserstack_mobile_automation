function redact(value) {
  let message = String(value);
  for (const key of ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']) {
    if (process.env[key]) message = message.split(process.env[key]).join('[REDACTED]');
  }
  return message.replace(/bs:\/\/[^\s"']+/g, 'bs://[REDACTED]');
}
module.exports = {
  info: (message) => console.log('[INFO] ' + redact(message)),
  warn: (message) => console.warn('[WARN] ' + redact(message)),
};
