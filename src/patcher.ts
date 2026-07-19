import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export const PATCH_START = '/* codex-rtl-vazirmatn:start */';
export const PATCH_END = '/* codex-rtl-vazirmatn:end */';
export const FONT_FILES = {
  arabic: 'codex-rtl-vazirmatn-arabic.woff2',
  latinExt: 'codex-rtl-vazirmatn-latin-ext.woff2',
  latin: 'codex-rtl-vazirmatn-latin.woff2',
} as const;

export interface PatchOptions {
  fontScale: number;
  rtlInputs: boolean;
}

export interface PatchResult {
  changed: string[];
  alreadyPatched: string[];
}

export interface FontSources {
  arabic: string;
  latinExt: string;
  latin: string;
}

async function walk(directory: string): Promise<string[]> {
  const output: string[] = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else output.push(absolute);
  }
  return output;
}

export async function findCodexStyles(extensionRoot: string): Promise<string[]> {
  const files = await walk(extensionRoot);
  const styles = files.filter((file) => {
    if (path.extname(file).toLowerCase() !== '.css') return false;
    const normalized = file.replaceAll('\\', '/').toLowerCase();
    return normalized.includes('/webview/') || normalized.includes('/assets/') || normalized.includes('/media/');
  });

  const useful: string[] = [];
  for (const file of styles) {
    const stat = await fs.stat(file);
    if (stat.size >= 1024) useful.push(file);
  }
  return useful;
}

export function removePatch(css: string): string {
  const start = css.indexOf(PATCH_START);
  if (start < 0) return css;
  const end = css.indexOf(PATCH_END, start);
  if (end < 0) return css.slice(0, start).trimEnd() + '\n';
  return (css.slice(0, start) + css.slice(end + PATCH_END.length)).trimEnd() + '\n';
}

export function makePatch(options: PatchOptions): string {
  const scale = Math.min(1.5, Math.max(0.8, options.fontScale));
  const inputs = options.rtlInputs
    ? `\ninput, textarea, [contenteditable="true"], [role="textbox"] {
  direction: rtl !important;
  text-align: right !important;
  font-family: "Vazirmatn Codex RTL", var(--vscode-font-family), sans-serif !important;
}`
    : '';

  return `${PATCH_START}
@font-face {
  font-family: "Vazirmatn Codex RTL";
  src: url("./${FONT_FILES.arabic}") format("woff2-variations");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC;
}

@font-face {
  font-family: "Vazirmatn Codex RTL";
  src: url("./${FONT_FILES.latinExt}") format("woff2-variations");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

@font-face {
  font-family: "Vazirmatn Codex RTL";
  src: url("./${FONT_FILES.latin}") format("woff2-variations");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:root, body, #root {
  font-family: "Vazirmatn Codex RTL", var(--vscode-font-family), sans-serif !important;
  font-size: calc(var(--vscode-font-size, 13px) * ${scale}) !important;
}

body, #root, main, [role="main"] {
  direction: rtl !important;
  text-align: right !important;
}

p, li, blockquote, h1, h2, h3, h4, h5, h6,
[class*="message"], [class*="markdown"], [class*="prose"] {
  text-align: start !important;
}

pre, code, kbd, samp, .monaco-editor,
[class*="code-block"], [class*="diff"] {
  direction: ltr !important;
  text-align: left !important;
  font-family: var(--vscode-editor-font-family), monospace !important;
}${inputs}
${PATCH_END}`;
}

export async function patchStyles(
  styleFiles: string[],
  fontSources: FontSources,
  options: PatchOptions,
): Promise<PatchResult> {
  const result: PatchResult = { changed: [], alreadyPatched: [] };
  for (const styleFile of styleFiles) {
    const current = await fs.readFile(styleFile, 'utf8');
    const hadPatch = current.includes(PATCH_START);
    const next = removePatch(current).trimEnd() + '\n\n' + makePatch(options) + '\n';
    await Promise.all(Object.entries(FONT_FILES).map(([subset, fileName]) =>
      fs.copyFile(fontSources[subset as keyof FontSources], path.join(path.dirname(styleFile), fileName)),
    ));
    if (next !== current) {
      await fs.writeFile(styleFile, next, 'utf8');
      result.changed.push(styleFile);
    } else if (hadPatch) {
      result.alreadyPatched.push(styleFile);
    }
  }
  return result;
}

export async function unpatchStyles(styleFiles: string[]): Promise<string[]> {
  const changed: string[] = [];
  for (const styleFile of styleFiles) {
    const current = await fs.readFile(styleFile, 'utf8');
    const next = removePatch(current);
    if (next !== current) {
      await fs.writeFile(styleFile, next, 'utf8');
      changed.push(styleFile);
    }
    await Promise.all(Object.values(FONT_FILES).map((fileName) =>
      fs.rm(path.join(path.dirname(styleFile), fileName), { force: true }),
    ));
  }
  return changed;
}
