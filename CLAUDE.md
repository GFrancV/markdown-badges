# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Astro)
npm run build     # Type-check (astro check) then build
npm run preview   # Preview production build locally
```

There is no test runner configured in this project.

## Stack

- **Astro 5** with React 19 islands for interactive components
- **TailwindCSS 4** for styling
- **TypeScript** throughout
- **Vercel** adapter for SSR deployment

Key libraries: `fuzzyjs` (badge search), `sonner` (toasts), `next-themes` (dark/light mode), `highlight.js` (code blocks), `@base-ui-components/react` + Radix UI (headless primitives).

## Architecture

### Data Flow

1. **Source of truth**: `src/data/badges.json` — static JSON with ~600+ badge definitions (`{ id, name, url, markdown, category }`).
2. **Service layer**: `src/services/badges.ts` — all badge filtering/retrieval logic using fuzzy search (fuzzyjs). This is where search, category filtering, and related-badge lookups live.
3. **Icons**: `src/services/icons.ts` — fetches simple-icons metadata dynamically from GitHub at runtime (used in the generator).
4. **Pages**: Astro pages in `src/pages/` define routes. Badge detail pages (`/badges/[id]`) are statically pre-rendered at build time from the JSON.

### State Management

- **Favorites**: `src/context/favorites-context.tsx` — React Context backed by localStorage (`mb:favorites`). Wrap components with `BadgeSidebarProvider` (sidebar slide-over) and consume via `useBadgeSidebar`.
- **Search state**: Stored in URL query params (`?query=X&category=Y`) for shareability; debounced 450ms via `use-debounce`.
- **Generator state**: Component-local `useState` in `src/pages/generator.astro` / generator components.

### Key Conventions

- **React components** live in `src/components/` and are used as Astro islands (`client:load`, `client:visible`).
- **Astro layouts** (`src/layouts/`) wrap pages with nav, footer, and theme/analytics providers.
- **Custom hooks** in `src/hooks/` (e.g., clipboard copy with toast feedback).
- **Utility functions** in `src/utils/` (DOM helpers, text sanitization) and `src/lib/` (SEO helpers, syntax highlighting setup).
- Infinite scroll loads badges in batches of 20.
- Ctrl+K keyboard shortcut focuses the search input globally.

### Adding Badges

New badges are added to `src/data/badges.json`. See `CONTRIBUTING.md` for the exact schema and guidelines.
