import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, '..', 'src', 'core');

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory).flatMap(name => {
    const path = join(directory, name);
    return statSync(path).isDirectory()
      ? collectTypeScriptFiles(path)
      : path.endsWith('.ts')
        ? [path]
        : [];
  });
}

test('CalendarCore never imports business modules', () => {
  const violations = collectTypeScriptFiles(coreRoot).filter(path => {
    const source = readFileSync(path, 'utf8');
    return /from\s+['"][^'"]*modules(?:\/|['"])/.test(source);
  });

  assert.deepEqual(
    violations,
    [],
    `Core must not depend on business modules: ${violations.join(', ')}`,
  );
});
