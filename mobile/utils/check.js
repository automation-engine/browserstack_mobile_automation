const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
function check(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', 'reports', 'logs'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) check(file);
    else if (file.endsWith('.js')) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
      if (result.error) throw result.error;
      for (const match of fs.readFileSync(file, 'utf8').matchAll(/require\(['"](\.[^'"]+)['"]\)/g)) {
        try { require.resolve(path.resolve(path.dirname(file), match[1])); }
        catch { throw new Error('Unresolved import in ' + path.relative(root, file) + ': ' + match[1]); }
      }
      if (result.status !== 0) { console.error(result.stderr); process.exitCode = 1; }
    } else if (file.endsWith('.json')) JSON.parse(fs.readFileSync(file, 'utf8'));
  }
}
check(root);
if (!process.exitCode) console.log('JavaScript syntax, relative imports and JSON checks passed.');
