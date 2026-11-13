import { spawnSync } from 'node:child_process';
import path from 'node:path';

const candidates = [
  process.env.PROTOOLS_PYTHON,
  process.platform === 'win32' && process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Python', 'bin', 'python.exe'),
  'python3', 'python', 'py',
].filter(Boolean);
for (const executable of candidates) {
  const probe = spawnSync(executable, ['-c', 'import sys; sys.exit(0 if sys.version_info.major == 3 else 1)'], { windowsHide: true, stdio: 'ignore' });
  if (probe.status !== 0) continue;
  const result = spawnSync(executable, process.argv.slice(2), { windowsHide: true, stdio: 'inherit' });
  process.exit(result.status ?? 1);
}
console.error('Python 3 unavailable. Set PROTOOLS_PYTHON to a working Python executable.');
process.exit(1);
