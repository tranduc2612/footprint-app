# Repository Guidelines

## Project Structure

This repository is a React 19 and TypeScript single-page app built with Vite. Application code lives in `src/`: `App.tsx` configures routes, pages live in `src/pages/`, reusable UI lives in `src/components/`, and `src/content/archive.json` records trip and gallery metadata. Store album photos in `public/media/` and refer to them with root-relative URLs such as `/media/place/photo.jpg`; add new photos to the archive metadata when they should appear in the app. `main.tsx` mounts the app, and `App.css` / `index.css` hold component and global styles. Other imported source assets belong in `src/assets/`. There is no dedicated test directory yet.

## Build and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` runs TypeScript project checks and creates the production bundle in `dist/`.
- `npm run preview` serves the built bundle locally; run `npm run build` first.
- `npm run lint` checks the project with ESLint.

## Coding Style

Use TypeScript and React function components; keep UI in `.tsx` files and styles in CSS files. Follow the existing two-space indentation and single-quoted TypeScript imports. Use PascalCase for component names and files (for example, `App.tsx`), camelCase for variables and functions, and descriptive lowercase names for CSS classes. Keep imports explicit and remove unused variables; TypeScript is configured to flag unused locals and parameters. Run `npm run lint` before submitting changes.

## Testing

No test framework or `test` script is configured. For changes, run `npm run lint` and `npm run build`, then exercise the affected UI with `npm run dev` in a browser. If adding tests, introduce a framework and document its command and naming convention here.

## Commits and Pull Requests

Git metadata is not present in this checkout, so existing commit conventions cannot be verified. Write concise, imperative commit subjects that describe the change (for example, `Add responsive settings panel`). Pull requests should explain user-visible changes, include relevant screenshots for UI updates, and list the validation commands run. Link related issues when applicable.

## Configuration

Keep environment-specific values and secrets out of source control. Update `package-lock.json` together with `package.json` when dependencies change.
