# Project Context and Repository Guidelines

## Product

Dấu Chân is a responsive travel photo and video album for revisiting shared trips. The interface supports Vietnamese and English; Vietnamese is the default. The language preference is saved in browser local storage and persists across routes and reloads.

## Stack and Structure

This is a React 19 and TypeScript single-page application built with Vite and React Router.

- `src/main.tsx` mounts `BrowserRouter`.
- `src/App.tsx` defines `/`, `/trips/:tripId`, the not-found page, and the app-wide `LanguageProvider`.
- `src/pages/HomePage.tsx` renders the hero, album, places map, and memorable-moments slider.
- `src/pages/TripDetailPage.tsx` renders an individual trip and its photo gallery.
- `src/components/` contains reusable album cards, the Leaflet map, footer, and photo lightbox.
- `src/content/archive.json` is the source of trip, place, statistic, hero-image, and memorable-gallery metadata.
- `src/content/archive.ts` resolves media paths with Vite's base path for local and GitHub Pages builds.
- `src/content/language.tsx` contains the language context, UI translations, localized place names, and date formatters.
- `src/App.css` and `src/index.css` contain component and global styles.
- `public/media/` is the canonical location for web-ready album images.

## Content and Media Rules

- Keep album media in `public/media/`; reference it from `archive.json` with paths such as `/media/ninhbinh-2026/photo.jpg`.
- Put home hero imagery in `public/media/home-pic/` and set `heroImage` in `archive.json`.
- Put selected highlight imagery in `public/media/memorable/` and list it in `gallery`. The `gallery` list drives the memorable slider; it is intentionally curated rather than auto-populated from trip photos.
- Put trip photos in the matching trip folder. Update that visit's `cover` and `images` fields in `archive.json` when the displayed set changes.
- Update `places`, trip metadata, and aggregate `stats` in `archive.json` when adding trips or locations.
- Prefer JPEG, PNG, or WebP for browser compatibility. Do not leave redundant originals when the archive no longer references them and the user has requested cleanup.
- Trip IDs should end in an ISO date (`...-YYYY-MM-DD`); date helpers use this suffix for English formatting.
- Keep source-language copy in `archive.json` in Vietnamese. Add translated UI strings, English place names, and localized image descriptions in `language.tsx`.
- When adding user-visible text or accessible labels, provide both Vietnamese and English. Keep the brand name “Dấu Chân” unchanged.

## Commands

- `npm install` installs dependencies.
- `npm run dev` starts the local Vite server.
- `npm run lint` checks the project with ESLint.
- `npm run build` runs TypeScript checks and builds into `dist/`.
- `npm run preview` serves the built site locally.

Run `npm run lint` and `npm run build` after code changes. No separate test framework is configured. For UI changes, inspect the affected page at desktop and mobile widths when practical.

## Style

Use React function components and TypeScript. Keep UI in `.tsx` files and styles in CSS files. Follow two-space indentation, single-quoted TypeScript imports, PascalCase component names, camelCase variables, and descriptive lowercase CSS classes. Keep imports explicit and remove unused code.

## GitHub Pages and Git Safety

- `.github/workflows/deploy.yml` deploys automatically after a push to `main` and can also be run manually.
- `vite.config.ts` sets `/footprint-app/` as the production base path on GitHub Actions; preserve this for the current GitHub Pages project site.
- The deploy workflow copies `dist/index.html` to `dist/404.html` so React Router deep links continue to work.
- Do not commit, push, or deploy unless the user explicitly asks. A direct request to publish authorizes the corresponding commit and push for that request.
- Keep secrets and environment-specific credentials out of the repository.
