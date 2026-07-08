#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

// Only run on a real local install in this repo — not as a dependency,
// and never during CI / deploy builds.
const isLocalInstall = resolve(process.env.INIT_CWD || '') === resolve(process.cwd());
const isCi =
  process.env.CI ||
  process.env.VERCEL ||
  process.env.NETLIFY ||
  process.env.RENDER ||
  process.env.FLY_APP_NAME ||
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.SKIP_AI_SETUP;

if (!isLocalInstall || isCi) {
  process.exit(0);
}

// Strip pnpm-injected npm_config_* vars to avoid spurious npm warnings.
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith('npm_config_'))
);

execSync('pnpm run ai:sync && pnpm run ai:skills', { stdio: 'inherit', env });
