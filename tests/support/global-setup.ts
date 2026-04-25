import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = Number(process.env.TEST_PORT ?? 3100);
const BASE = `http://localhost:${PORT}`;
const IS_WINDOWS = process.platform === "win32";

let server: ChildProcess | null = null;

async function waitForReady(timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok || res.status === 404) return;
    } catch {
      // not up yet
    }
    await delay(500);
  }
  throw new Error(`Dev server did not become ready on ${BASE} within ${timeoutMs}ms`);
}

export async function setup() {
  if (!process.env.RUN_GHL_TESTS) {
    console.log("[vitest:setup] RUN_GHL_TESTS not set — skipping dev server boot");
    return;
  }

  try {
    const probe = await fetch(`${BASE}/`);
    if (probe.ok || probe.status === 404) {
      console.log(`[vitest:setup] reusing existing server at ${BASE}`);
      return;
    }
  } catch {
    // will spawn
  }

  console.log(`[vitest:setup] spawning: pnpm dev --port ${PORT}`);
  server = spawn("pnpm", ["dev", "--port", String(PORT)], {
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "development" },
  });

  server.stdout?.on("data", (chunk) => {
    const s = String(chunk);
    if (/error/i.test(s)) process.stderr.write(`[next] ${s}`);
  });
  server.stderr?.on("data", (chunk) => process.stderr.write(`[next:err] ${chunk}`));

  await waitForReady();
  console.log(`[vitest:setup] dev server ready at ${BASE}`);
}

export async function teardown() {
  if (!server) return;
  console.log("[vitest:teardown] killing dev server");
  if (IS_WINDOWS && server.pid) {
    // pnpm dev spawns a child node process; SIGTERM won't reach the grandchild on Windows.
    // Use taskkill /T to kill the whole process tree.
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
    await delay(500);
    if (!server.killed) server.kill("SIGKILL");
  }
  await delay(500);
}
