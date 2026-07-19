# Contributing

Thank you for helping improve Codex Persian RTL for VS Code.

## Development setup

1. Install Node.js 22 or newer and VS Code 1.90 or newer.
2. Run `npm ci`.
3. Run `npm test`.
4. Press `F5` to launch an Extension Development Host.

## Pull requests

- Keep changes focused and include tests for patching behavior.
- Run `npm test` and `npm run package` before submitting.
- Update `CHANGELOG.md` for user-visible changes.
- Do not commit generated `out/`, `node_modules/`, or `.vsix` files.

## Reporting compatibility issues

Include your OS, VS Code version, Codex extension version, and the output of **Codex RTL: Show Status**. Do not include prompts, conversations, access tokens, or other private data.
