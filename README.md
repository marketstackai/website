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
