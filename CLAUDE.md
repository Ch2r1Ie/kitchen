# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start dev server (Turbopack)
- `pnpm build` — production build
- `pnpm lint` — run ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — typecheck (no separate typecheck script defined)
- `npx prettier --write <file>` — format; `.prettierrc` enforces single quotes, no semicolons, trailing commas, 80 col width

No test runner is configured in this repo (no test script, no test framework dependency).

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`) — don't use npm/yarn.

## Architecture

Next.js 16 App Router project, single app with three independent client-rendered pages (no shared layout state, each is `'use client'` and self-contained):

- `app/page.tsx` — public marketing site (hero, updates feed, links to `/scan`)
- `app/scan/page.tsx` — customer-facing "scan to order" flow: landing (name/phone entry) → menu browsing/cart → order tracking. Single large component driving all three screens via a `screen` state union (`'landing' | 'menu' | 'tracking'`), not separate routes.
- `app/portal/page.tsx` — kitchen/staff dashboard: live orders, table status, menu availability management. Built around `Sidebar` primitives from `components/ui/sidebar.tsx`.

Each of these pages is a large, mostly self-contained file (400-1000 lines) with its own local types (`MenuDef`, `CartLine`, `Order`, etc.) and mock data defined inline at the top of the file — there is no shared data layer or API client yet. Don't assume state/types are shared across `page.tsx`, `scan/page.tsx`, and `portal/page.tsx`; each defines its own copies (e.g. `OrderStatus` is redefined per-file).

### UI components

`components/ui/*` are shadcn/ui components (`components.json`: style `new-york`, base color `zinc`, icon library `lucide`). Path alias `@/*` maps to repo root. When adding new shadcn components, follow the existing aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`).

`lib/utils.ts` exports `cn()` = `twMerge(clsx(...))` — always use this for merging conditional/override class names rather than string concatenation, since `twMerge` correctly resolves conflicting Tailwind utility classes (last one wins).

### Styling

Tailwind v4 (CSS-based config via `@theme inline` in `app/globals.css`, no `tailwind.config.ts`). Theme tokens (colors, radius) are CSS custom properties in `:root`, with a `@media (prefers-color-scheme: dark)` override block — dark mode follows system preference, not a class toggle.

Mobile-first responsive pattern used throughout: base (unprefixed) classes target mobile, `sm:` prefixed classes scale up for larger viewports.

### Notable details

- `app/layout.tsx` exports an explicit `viewport` with `maximumScale: 1` to prevent iOS Safari auto-zoom on input focus — keep mobile form inputs at `text-base` (16px) or larger to reinforce this.
- `html-to-image` is used in `app/scan/page.tsx` to export the order-tracking card as a downloadable PNG.
