# Agent configuration

Rulesync reads `rulesync.jsonc` and `.rulesync/`. Preview with `pnpm run ai:config:preview`, apply with `pnpm run ai:config:sync`, and verify with `pnpm run ai:config:check`. Edit the authored sources before generating; native instruction and MCP files are delivery outputs. Run these commands explicitly after a checkout or source change.

Skills remain selected in `skills.config.json` and installed separately by Vercel through `pnpm run ai:skills:sync`. Dependency installation and agent startup do not run configuration or skills installation.

Secrets are environment references; generation does not distribute credentials or OAuth logins between clients. Keep machine-specific values out of committed files. Before the first local generation, preserve any intentional edits in existing native files and retire links to the old source directory.

Rulesync 43 does not provide a Gemini CLI adapter. The tracked `GEMINI.md` imports generated `AGENTS.md`; any project MCP servers are preserved in the authored native `.gemini/settings.json`. That file is maintained directly and is not a Rulesync delivery output.
