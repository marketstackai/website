# Market Stack — Website

The marketing website for [Market Stack](https://marketstack.ai).
## Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS 4 + tailwindcss-animate
- **UI Components**: shadcn/ui (Radix UI)
- **Language**: TypeScript (strict)
- **Icons**: Lucide
- **Backend CRM**: GoHighLevel (GHL)
- **Package Manager**: pnpm

## AI Configuration & Agents

This project uses [LNAI](https://lnai.sh) to maintain a unified cross-platform rule-set and configuration for AI coding assistants (Claude Code, OpenCode, and Gemini/Antigravity). Centralized configuration lives within `.ai/` and get pushed to respecitve configuration directories post install, at start of a new session, or when `pnpm run ai:sync` is run.

### Modular AI Skills (Vercel)
We leverage Vercel's open [skills CLI](https://github.com/vercel-labs/skills) to extend agent capabilities dynamically across the stack without polluting version control. 

When you run `pnpm install`, an `ai:skills` downstream hook executes non-interactively to fetch and distribute baseline skill packages (e.g. from `vercel-labs/agent-skills`).

*(Note: Because they are built dynamically per-environment, skills and lockfiles are `.gitignored` to keep the repository un-cluttered).*
