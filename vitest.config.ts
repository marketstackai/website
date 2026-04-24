import { defineConfig } from "vitest/config";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(): Record<string, string> {
  try {
    const raw = fs.readFileSync(path.resolve(__dirname, ".env.local"), "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (m) out[m[1]] = m[2].trim();
    }
    return out;
  } catch {
    return {};
  }
}

export default defineConfig({
  test: {
    include: ["tests/integration/**/*.test.ts"],
    globalSetup: ["tests/support/global-setup.ts"],
    testTimeout: 60_000,
    hookTimeout: 180_000,
    pool: "forks",
    reporters: ["default"],
    env: {
      ...loadEnvFile(),
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
