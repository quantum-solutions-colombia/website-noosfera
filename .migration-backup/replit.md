# Noösfera — Sistema de Monitoreo Cardíaco

Noösfera transforms users' unique heartbeat patterns into digital NFT art using AI-powered visualization, with a full dashboard for BCI (Brain-Computer Interface) simulation.

## Run & Operate

- `pnpm --filter @workspace/noosfera run dev` — run the frontend (Vite, port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS v4 + wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- UI: shadcn/ui, Radix UI, Framer Motion, Recharts, Lucide icons
- Auth: localStorage-based (demo/admin users pre-seeded)

## Where things live

- `artifacts/noosfera/` — main frontend artifact (React + Vite)
  - `src/pages/` — route components (home, auth, dashboard, admin, pricing, docs, legal)
  - `src/components/` — shared components (ui/, dashboard, hero-carousel, etc.)
  - `src/contexts/` — auth-context, noosfera-context
  - `src/lib-app/` — local-storage.ts (localStorage DB), utils.ts
- `artifacts/api-server/` — Express backend (healthz only, no custom routes yet)
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Fully client-side app: auth and data stored in localStorage (no backend DB calls from the frontend yet)
- wouter used for client-side routing (replaced Next.js file-based routing)
- `@/lib-app/` alias used for app-specific lib files to avoid conflict with `@workspace/` lib packages
- next-themes kept for ThemeProvider compatibility (no Next.js dependency, just the npm package)
- Image generation uses SVG data URIs (no external API dependency)

## Product

- Landing page with hero carousel and KPI highlights
- Login/register with localStorage user persistence
- User dashboard with BCI simulation and NFT art generation
- Admin panel for user management (admin@noosfera.com / admin123)
- Demo mode accessible without login (demo@noosfera.com / demo123)
- Pricing, docs, company, and legal pages

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Demo credentials: `demo@noosfera.com` / `demo123`, Admin: `admin@noosfera.com` / `admin123`
- localStorage is reset on browser clear — no persistent backend storage yet
- Do NOT run `pnpm dev` at workspace root — use `pnpm --filter @workspace/noosfera run dev`
- The `@/lib` alias maps to `artifacts/noosfera/src/lib-app/` (NOT `lib/` workspace packages)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
