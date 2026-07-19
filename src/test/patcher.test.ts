import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import test from 'node:test';
import {
  FONT_FILES,
  findCodexStyles,
  makePatch,
  PATCH_END,
  PATCH_START,
  patchStyles,
  removePatch,
  unpatchStyles,
} from '../patcher';

test('makePatch creates RTL rules and a reversible marker', () => {
  const css = makePatch({ fontScale: 1, rtlInputs: true });
  assert.match(css, /direction: rtl/);
  assert.match(css, /Vazirmatn Codex RTL/);
  assert.doesNotMatch(css, /^\+/m);
  assert.ok(css.startsWith(PATCH_START));
  assert.ok(css.endsWith(PATCH_END));
});

test('input RTL can be disabled', () => {
  const css = makePatch({ fontScale: 1, rtlInputs: false });
  assert.doesNotMatch(css, /\[role="textbox"\]/);
});

test('removePatch preserves original CSS', () => {
  const original = '.foo { color: red; }\n';
  const patched = `${original}\n${makePatch({ fontScale: 1, rtlInputs: true })}\n`;
  assert.equal(removePatch(patched), original);
});

test('patch and unpatch round-trip a discovered webview stylesheet', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-rtl-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const assets = path.join(root, 'webview', 'assets');
  const fonts = path.join(root, 'test-fonts');
  await fs.mkdir(assets, { recursive: true });
  await fs.mkdir(fonts, { recursive: true });
  const original = '.message { color: red; }\n'.repeat(60);
  const stylesheet = path.join(assets, 'index.css');
  await fs.writeFile(stylesheet, original);

  const fontSources = {
    arabic: path.join(fonts, 'arabic.woff2'),
    latinExt: path.join(fonts, 'latin-ext.woff2'),
    latin: path.join(fonts, 'latin.woff2'),
  };
  await Promise.all(Object.values(fontSources).map((font) => fs.writeFile(font, 'font')));

  const styles = await findCodexStyles(root);
  assert.deepEqual(styles, [stylesheet]);
  await patchStyles(styles, fontSources, { fontScale: 1, rtlInputs: true });
  assert.match(await fs.readFile(stylesheet, 'utf8'), /codex-rtl-vazirmatn:start/);
  for (const fileName of Object.values(FONT_FILES)) {
    await fs.access(path.join(assets, fileName));
  }

  await unpatchStyles(styles);
  assert.equal(await fs.readFile(stylesheet, 'utf8'), original);
  for (const fileName of Object.values(FONT_FILES)) {
    await assert.rejects(fs.access(path.join(assets, fileName)));
  }
});
