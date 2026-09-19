import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, '..', 'src');

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

function findImports(
  directory: string,
  forbidden: RegExp,
): string[] {
  return collectTypeScriptFiles(directory)
    .filter(path => forbidden.test(readFileSync(path, 'utf8')))
    .map(path => relative(srcRoot, path));
}

test('Core never imports outer layers or business modules', () => {
  assert.deepEqual(
    findImports(
      join(srcRoot, 'core'),
      /from\s+['"][^'"]*(?:modules|app|host|ui|renderers)(?:\/|['"])/,
    ),
    [],
  );
});

test('business modules never import App, Host, UI or renderers', () => {
  assert.deepEqual(
    findImports(
      join(srcRoot, 'modules'),
      /from\s+['"][^'"]*(?:app|host|ui|renderers)(?:\/|['"])/,
    ),
    [],
  );
});

test('App never imports Host, UI or renderers', () => {
  assert.deepEqual(
    findImports(
      join(srcRoot, 'app'),
      /from\s+['"][^'"]*(?:host|ui|renderers)(?:\/|['"])/,
    ),
    [],
  );
});

test('Host never imports UI or renderers', () => {
  assert.deepEqual(
    findImports(
      join(srcRoot, 'host'),
      /from\s+['"][^'"]*(?:ui|renderers)(?:\/|['"])/,
    ),
    [],
  );
});

test('renderers depend on UI contracts, not app/host/modules/core directly', () => {
  assert.deepEqual(
    findImports(
      join(srcRoot, 'renderers'),
      /from\s+['"][^'"]*(?:app|host|modules|core)(?:\/|['"])/,
    ),
    [],
  );
});
