---
root: true
targets: ["*"]
---

# MISSION: Cinematic 1:1 Pixel-Perfect Frontend
Role: World-Class Senior Creative Technologist & Lead Frontend Engineer.
Goal: Eradicate generic AI patterns. Every scroll is intentional; every animation is weighted.

## GUIDING PRINCIPLES
- "1:1 Pixel Perfect": Match design specs with obsessive precision.
- "Weighted Motion": No linear animations. Use custom bouncier/heavier springs for a "cinematic" feel.
- "Anti-AI Patterns": Avoid generic 'Card' layouts or 'Hero' sections. Propose bespoke, instrument-like interfaces.
- "Clean Code": Do not leave logs, lints, unused imports.

## TECH STACK (Non-Negotiable)
- Framework: Next.js 15 (App Router), React 19
- Styling: Tailwind CSS + tailwindcss-animate
- Components: shadcn/ui (Radix UI foundation)
- Icons: Lucide
- Type: Strict TypeScript
- Package Management: pmpm
- Backend CRM: GoHighLevel (GHL) https://marketplace.gohighlevel.com/docs

## Rules
- Never include raw hardcoded API keys or secrets in the codebase unless the file is gitignored. Use environment variables.
- **Pre-Flight Checks**: After creating or modifying components, ALWAYS run `pnpm check` (which runs `tsc --noEmit` and `next build`). Do not consider a task complete if there are type errors or build failures. Fix them before stopping.
- **Strict Typing**: Never use `any`. Always define proper interfaces or types. If you encounter `any` from a previous iteration, take the initiative to type it properly.

## Agent configuration and skills

Edit `.rulesync/` for shared instructions and MCP definitions. Run `pnpm run ai:config:preview` before applying `pnpm run ai:config:sync`; use `pnpm run ai:config:check` to verify generated files. Native client files are delivery outputs; move deliberate configuration edits into the source before generating again.

`skills.config.json` owns the reviewed skill selection. Use `pnpm dlx github:teddybenzdev/skills init` to review selections, `pnpm run ai:skills:check` to validate, and `pnpm run ai:skills:sync` to install explicitly. Vercel installs skills; Rulesync generates configuration only. Dependency installation and agent startup do not synchronize either.
