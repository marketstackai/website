const { execSync } = require('child_process');

module.exports = {
  event: async ({ event }) => {
    if (event.type === 'session.created') {
      try {
        console.log("Running lnai sync from OpenCode hook...");
        execSync("pnpm exec lnai sync", { stdio: 'inherit' });
      } catch (e) {
        console.error("Failed to run lnai sync", e);
      }
    }
  }
};
