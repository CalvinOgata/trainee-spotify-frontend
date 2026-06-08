# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`, project references) then produce a production bundle in `dist/`
- `npm run lint` — run ESLint over the repo
- `npm run preview` — serve the built `dist/` for a smoke test of the production build

There is no test runner wired up yet.

## Architecture

Vite + React 19 + TypeScript single-page app, scaffolded from the `react-ts` template. Entry point is `src/main.tsx`, which mounts `<App />` into `#root` from `index.html`.

Styling is handled by **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (registered in `vite.config.ts`). The single global stylesheet is `src/index.css`, which contains just `@import "tailwindcss";` — Tailwind v4 needs no `tailwind.config.js` and no PostCSS config; theme customization, if needed, goes inline in CSS using `@theme { ... }`. Prefer utility classes in JSX over new CSS files.

TypeScript uses project references: `tsconfig.json` is a solution file that delegates to `tsconfig.app.json` (app sources under `src/`) and `tsconfig.node.json` (Vite config and other Node-side tooling). Because of this, run `tsc -b` (not `tsc`) when type-checking from the command line — that's what `npm run build` does.

ESLint is configured via flat config in `eslint.config.js` using `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (the Vite-specific preset). Lints `**/*.{ts,tsx}` and ignores `dist/`.
