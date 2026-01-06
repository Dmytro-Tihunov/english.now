---
alwaysApply: true
---

# English.Now Project Rules

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Web**: React 19, TanStack Router, Vite, Tailwind CSS v4
- **Server**: Hono, tRPC
- **Database**: PostgreSQL + Drizzle ORM (+ pgvector planned)
- **Auth**: better-auth
- **Styling**: Tailwind CSS + Radix UI primitives + shadcn/ui patterns
- **Linting**: Biome (not ESLint/Prettier)

## Project Structure
- `apps/web` - React frontend (port 3001)
- `apps/server` - Hono API server (port 3000)
- `apps/native` - React Native app
- `packages/api` - tRPC routers
- `packages/auth` - Authentication config
- `packages/db` - Drizzle schema and migrations

## Code Conventions
- Use `cn()` from `@/lib/utils` for className merging
- Prefer `type` imports: `import type { X } from "y"`
- Components use function declarations, not arrow functions for exports
- Use Biome formatting (tabs, no trailing commas in single-line)
- Path alias: `@/` maps to `src/`

## Grammar Learning Domain
- CEFR levels: A1, A2, B1, B2, C1, C2
- Mastery states: not_started, struggling, learning, mastered
- Topics have prerequisites forming a learning graph
- i18n: JSONB content with locale keys (en, es, uk, etc.)

## UI Patterns
- Use shadcn/ui component patterns from `components/ui/`
- ReactFlow for graph visualizations
- Drawer panels slide from right
- Color-coded CEFR badges (emerald→teal→blue→indigo→purple→rose)

## Don't
- Don't use ESLint or Prettier (we use Biome)
- Don't add unnecessary dependencies
- Don't create new UI components if shadcn/ui pattern exists
- Don't use `var` - use `const` or `let`