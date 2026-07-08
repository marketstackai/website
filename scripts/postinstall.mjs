#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const isLocalInstall = resolve(process.env.INIT_CWD || '') === resolve(process.cwd());

if (isLocalInstall) {
  // Strip pnpm-injected npm_config_* vars to avoid spurious npm warnings
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([k]) => !k.startsWith('npm_config_'))
  );
  execSync('pnpm run ai:sync && pnpm run ai:skills', { stdio: 'inherit', env });
}
