# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Astro)
npm run build     # Type-check (astro check) then build
npm run preview   # Preview production build locally
npm test          # Run Vitest suites in test/ (pretest regenerates data/badges.json)
npm run badges:sync     # Refresh data/badges.upstream.json from upstream (network)
npm run icons:generate  # Regenerate public/simple-icons.json (also runs in prebuild)
```

## Stack

- **Astro 5** with React 19 islands for interactive components
- **TailwindCSS 4** for styling
- **TypeScript** throughout
- **Vercel** adapter for SSR deployment

Key libraries: `fuzzyjs` (badge search), `sonner` (toasts), `next-themes` (dark/light mode), `highlight.js` (code blocks), `@base-ui-components/react` + Radix UI (headless primitives).

## Architecture

### Data Flow

1. **Source of truth**: `data/badges.upstream.json` (weekly upstream snapshot, `pnpm badges:sync`) + `data/badges.custom.json`, merged offline by `pnpm badges:generate` into the gitignored `data/badges.json` (~800 badges, `{ id, name, url, markdown, categories }`). Runs automatically before `dev`, `test` and `build`.
2. **Service layer**: `src/services/badges.ts` — all badge filtering/retrieval logic using fuzzy search (fuzzyjs). This is where search, category filtering, and related-badge lookups live.
3. **Icons**: `scripts/generate-simple-icons.js` writes a slim `public/simple-icons.json` (`{ title, slug, hex }`) at build time; `src/services/simple-icons.ts` fetches it same-origin for the generator. Never fetch simple-icons from GitHub at runtime.
4. **Pages**: Astro pages in `src/pages/` define routes. Badge detail pages (`/badges/[id]`) are statically pre-rendered at build time from the JSON.

### State Management

- **Favorites**: `src/context/favorites-context.tsx` — React Context backed by localStorage (`mb:favorites`). Wrap components with `BadgeSidebarProvider` (sidebar slide-over) and consume via `useBadgeSidebar`.
- **Search state**: Stored in URL query params (`?query=X&category=Y`) for shareability; debounced 450ms via `use-debounce`.
- **Generator state**: A single `BadgeConfig` in `src/components/badge-generator.tsx`, synced to query params. URL building/parsing lives in `src/lib/badge-url.ts` (tested); `generator.astro` passes `Astro.url.search` so SSR and client start from the same state.

### Key Conventions

- **React components** live in `src/components/` and are used as Astro islands (`client:load`, `client:visible`).
- **Astro layouts** (`src/layouts/`) wrap pages with nav, footer, and theme/analytics providers.
- **Custom hooks** in `src/hooks/` (e.g., clipboard copy with toast feedback).
- **Utility functions** in `src/utils/` (DOM helpers, text sanitization) and `src/lib/` (SEO helpers, syntax highlighting setup).
- Infinite scroll loads badges in batches of 20.
- Ctrl+K keyboard shortcut focuses the search input globally.

### Adding Badges

`data/badges.json` is generated and gitignored; `data/badges.upstream.json` is only written by `scripts/sync-upstream.js` (weekly workflow). Never edit either by hand. Project-owned badges go in `data/badges.custom.json`. See `CONTRIBUTING.md` for the exact schema and guidelines.
