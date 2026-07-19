# Codex Persian RTL for VS Code

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vazirmatn: OFL-1.1](https://img.shields.io/badge/Vazirmatn-OFL--1.1-green.svg)](THIRD_PARTY_NOTICES.md)

An unofficial companion extension that adds a polished right-to-left layout and the [Vazirmatn](https://github.com/rastikerdar/vazirmatn) typeface to the official Codex extension for Visual Studio Code.

[راهنمای فارسی](README.fa.md)

## Features

- Right-to-left layout for the Codex interface and prompt editor
- Bundled Vazirmatn variable font for Persian, Arabic, and Latin text
- Left-to-right rendering for code blocks, diffs, and editor content
- Configurable font-size scaling and input direction
- Reversible changes with a dedicated restore command
- No remote font requests, telemetry, or user-data collection

## Requirements

- Visual Studio Code 1.90 or newer
- The official Codex extension (`openai.chatgpt`)

## Installation

Download the latest `.vsix` file from [GitHub Releases](https://github.com/TahaDashti/RTL-Codex-VSCode/releases), then run:

```powershell
code --install-extension .\RTL-Codex-VSCode-0.2.0.vsix
```

You can also open the Extensions view in VS Code, select the three-dot menu, choose **Install from VSIX...**, and select the downloaded file.

After installation:

1. Open the Command Palette with `Ctrl+Shift+P`.
2. Run `Codex RTL: Enable RTL and Vazirmatn`.
3. Select **Reload Window** when prompted.

## Commands

| Command | Description |
| --- | --- |
| `Codex RTL: Enable RTL and Vazirmatn` | Applies or refreshes the RTL stylesheet and bundled font. |
| `Codex RTL: Disable and Restore Original Styles` | Removes this extension's patch and copied font files. |
| `Codex RTL: Show Status` | Reports whether compatible Codex stylesheets are patched. |

## Settings

| Setting | Default | Description |
| --- | ---: | --- |
| `codexRtl.fontScale` | `1` | Font-size multiplier from `0.8` to `1.5`. |
| `codexRtl.rtlInputs` | `true` | Applies RTL direction to inputs and the prompt editor. |

## Compatibility notice

VS Code webviews are isolated, so this extension applies a small and clearly marked CSS patch directly to the locally installed Codex extension. The operation is reversible, but updating Codex will normally replace the patched files. Run **Codex RTL: Enable RTL and Vazirmatn** again after a Codex update.

Because files inside another installed extension are modified, VS Code may display an extension integrity warning. Use **Codex RTL: Disable and Restore Original Styles** before reporting Codex interface issues to OpenAI.

## Privacy

This extension does not access prompts, conversations, credentials, workspace files, or network services. It only reads and updates compatible stylesheet files inside the locally installed Codex extension.

## Development

```powershell
npm ci
npm test
npm run package
```

Press `F5` in VS Code to start an Extension Development Host. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## Disclaimer

This is an independent community project. It is not affiliated with, endorsed by, or supported by OpenAI. Codex, Visual Studio Code, Microsoft, and OpenAI are trademarks of their respective owners.

## License

The source code is available under the [MIT License](LICENSE). Vazirmatn is distributed under the SIL Open Font License 1.1; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
