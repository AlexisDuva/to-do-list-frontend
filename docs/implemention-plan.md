# Implementation Plan — To-Do List Frontend

Goal: build this step by step so the developer can read and understand each part, rather than getting a fully generated app at once. **Stop after each step** and wait for confirmation before moving to the next one.

Reference docs: [tech-stack.md](./tech-stack.md), backend [api-documentation.md](https://github.com/AlexisDuva/to-do-list/blob/master/docs/api-documentation.md).

## Steps

1. **Project scaffolding**
   1. Generate the base project with `npm create vite@latest . -- --template vue-ts` — Vite's official scaffolding tool, generating `index.html`, `src/main.ts`, `src/App.vue`, `vite.config.ts`, `tsconfig.json`, `package.json`, etc.
   2. `npm install` to pull in Vue/Vite/TypeScript tooling.
   3. Add the core libraries decided in [tech-stack.md](./tech-stack.md): `npm install pinia vue-router axios`. Tailwind is deliberately left for step 2, since it has its own setup.
   4. Verify: `npm run dev`, open the printed local URL, confirm Vite's default starter page renders with no errors in the terminal or browser console.
   5. Review the generated structure: check `package.json` dependency versions, confirm `tsconfig.json` is sane, note starter boilerplate (e.g. the default `HelloWorld.vue`) to be replaced in later steps rather than built on top of.
   6. Commit: `"Step 1: project scaffolding"`.

2. **Tailwind CSS setup**
   1. Install Tailwind v4 and its official Vite plugin: `npm install tailwindcss @tailwindcss/vite` — v4 integrates via a Vite plugin rather than the old PostCSS config file (`tailwind.config.js`/`postcss.config.js`), so no separate config files are needed for a default setup.
   2. Register the plugin in `vite.config.ts` (`import tailwindcss from '@tailwindcss/vite'`, add to the `plugins` array).
   3. In `src/style.css`, replace the generated starter CSS with a single `@import "tailwindcss";` — this is what pulls in Tailwind's base styles and utility classes at build time.
   4. Verify: temporarily add a distinctive utility class (e.g. `text-blue-600 font-bold`) to an element in `src/App.vue`, run `npm run build`, and confirm the generated CSS output actually contains the corresponding rule (proves Tailwind is really scanning/generating from the source, not just that the import didn't error). Also run `npm run dev` and confirm no console/terminal errors.
   5. Remove the temporary test class from `App.vue` once confirmed (keep `src/App.vue` as the untouched starter for now — real markup starts in step 4/5).
   6. Commit: `"Step 2: Tailwind CSS setup"`.

## Working agreement

- Implement **one step at a time**.
- After finishing a step, stop, summarize what was created/changed and why, and wait for the developer to review before continuing.
- Keep code readable and avoid skipping ahead into later steps.
