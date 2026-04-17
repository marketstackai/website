import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * AI Agents to sync skills for.
 * These flags correspond to the directories in .agents/
 */
const AGENTS = ['antigravity', 'claude-code', 'opencode', 'codex'];

/**
 * Repositories containing skills.
 * filter: comma-separated list of skill names, or '*' for all.
 */
const REPOS = [
  { 
    name: 'vercel-labs/agent-skills', 
    filter: '*' 
  },
  { 
    name: 'teddybenzdev/skills', 
    filter: 'coding,fibery,github,marketstack,mcp' 
  }
];

/**
 * Global filter override (if needed)
 */
const GLOBAL_FILTER = null;

async function sync() {
  const isPrune = process.argv.includes('--prune');

  if (isPrune) {
    console.log('🧹 Pruning existing skills (.agents/skills)...');
    const agentsDir = join(process.cwd(), '.agents', 'skills');
    
    if (existsSync(agentsDir)) {
      rmSync(agentsDir, { recursive: true, force: true });
      console.log('✅ Pruned .agents/skills');
    }
  }

  for (const { name, filter } of REPOS) {
    console.log(`\n🚀 Syncing skills from: ${name}`);
    
    // Build agent flags: -a agent1 -a agent2 ...
    const agentFlags = AGENTS.map(a => `-a ${a}`).join(' ');
    
    const targetFilter = GLOBAL_FILTER || filter;
    let skillFlags = '';
    
    if (targetFilter !== '*') {
      // Split by comma or space and create individual -s flags
      const skills = targetFilter.split(/[,\s]+/).filter(Boolean);
      skillFlags = skills.map(s => `-s ${s}`).join(' ');
    }
    
    // Build command
    // -y: automatically install dependencies
    const command = `npx -y skills add ${name} ${agentFlags} ${skillFlags} -y`;
    
    try {
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.error(`❌ Failed to sync ${name}:`, error.message);
      // We don't exit(1) here to allow other repos to sync
    }
  }

  console.log('\n✨ Skills synchronization complete.');
}

sync();
