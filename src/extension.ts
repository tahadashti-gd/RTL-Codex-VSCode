import * as path from 'node:path';
import * as vscode from 'vscode';
import {
  PATCH_START,
  findCodexStyles,
  patchStyles,
  unpatchStyles,
} from './patcher';
import * as fs from 'node:fs/promises';

const CODEX_EXTENSION_IDS = ['openai.chatgpt'];

function getCodexExtension(): vscode.Extension<unknown> | undefined {
  return CODEX_EXTENSION_IDS
    .map((id) => vscode.extensions.getExtension(id))
    .find((extension): extension is vscode.Extension<unknown> => Boolean(extension));
}

async function getTarget(): Promise<{ styles: string[] }> {
  const extension = getCodexExtension();
  if (!extension) {
    throw new Error('The official Codex extension (openai.chatgpt) was not found. Install it first and try again.');
  }
  const styles = await findCodexStyles(extension.extensionPath);
  if (styles.length === 0) {
    throw new Error('No supported Codex webview stylesheet was found. The Codex extension structure may have changed.');
  }
  return { styles };
}

function offerReload(message: string): void {
  void vscode.window.showInformationMessage(message, 'Reload Window').then((choice) => {
    if (choice) void vscode.commands.executeCommand('workbench.action.reloadWindow');
  });
}

async function run(command: () => Promise<void>): Promise<void> {
  try {
    await command();
  } catch (error) {
    const errorCode = typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';
    const message = errorCode === 'EACCES' || errorCode === 'EPERM'
      ? 'VS Code could not modify the Codex extension files. Check file permissions, or reinstall both extensions for the current user.'
      : error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`Codex RTL: ${message}`);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('codexRtl.enable', () => run(async () => {
      const target = await getTarget();
      const configuration = vscode.workspace.getConfiguration('codexRtl');
      const fontDirectory = path.join(
        context.extensionPath,
        'node_modules',
        '@fontsource-variable',
        'vazirmatn',
        'files',
      );
      const fontSources = {
        arabic: path.join(fontDirectory, 'vazirmatn-arabic-wght-normal.woff2'),
        latinExt: path.join(fontDirectory, 'vazirmatn-latin-ext-wght-normal.woff2'),
        latin: path.join(fontDirectory, 'vazirmatn-latin-wght-normal.woff2'),
      };
      await Promise.all(Object.values(fontSources).map((font) => fs.access(font)));
      const result = await patchStyles(target.styles, fontSources, {
        fontScale: configuration.get<number>('fontScale', 1),
        rtlInputs: configuration.get<boolean>('rtlInputs', true),
      });
      const affected = result.changed.length + result.alreadyPatched.length;
      offerReload(`RTL layout and Vazirmatn were applied to ${affected} Codex stylesheet(s).`);
    })),

    vscode.commands.registerCommand('codexRtl.disable', () => run(async () => {
      const target = await getTarget();
      const changed = await unpatchStyles(target.styles);
      if (changed.length === 0) {
        void vscode.window.showInformationMessage('Codex RTL is already disabled.');
        return;
      }
      offerReload(`Original Codex styles were restored in ${changed.length} stylesheet(s).`);
    })),

    vscode.commands.registerCommand('codexRtl.status', () => run(async () => {
      const target = await getTarget();
      let patched = 0;
      for (const style of target.styles) {
        if ((await fs.readFile(style, 'utf8')).includes(PATCH_START)) patched += 1;
      }
      void vscode.window.showInformationMessage(
        patched > 0
          ? `Codex RTL is enabled (${patched} of ${target.styles.length} stylesheet(s) patched).`
          : `Codex RTL is disabled (${target.styles.length} compatible stylesheet(s) found).`,
      );
    })),
  );
}

export function deactivate(): void {}
