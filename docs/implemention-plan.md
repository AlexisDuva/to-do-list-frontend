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

3. **Types and API layer**
   1. Add `.env` / `.env.example` with `VITE_API_BASE_URL=http://localhost:8080/api`, so the backend URL is a config value, not hardcoded.
   2. `src/types/`: `task.ts` (`Priority` union, `Task` response shape, `TaskPayload` request shape, `TaskFilters` for the list query params), `project.ts` (`Project`, `ProjectPayload`), `tag.ts` (same shape as project), `api.ts` (`ApiErrorBody` matching the backend's uniform error shape, `ApiError` class to normalize it).
   3. `src/api/client.ts`: shared Axios instance with `baseURL` from `VITE_API_BASE_URL`, plus a response interceptor that rewraps any error response body into an `ApiError`.
   4. `src/api/tasks.ts`, `src/api/projects.ts`, `src/api/tags.ts`: thin typed functions per endpoint (`fetchTasks`, `fetchTask`, `createTask`, `updateTask`, `completeTask`, `incompleteTask`, `deleteTask`; `fetchAll`/`create`/`update`/`remove` for projects and tags).
   5. Verify: `npm run build` (runs `vue-tsc -b` first) to confirm everything type-checks with no compile errors. There's no UI yet, so nothing to check in a browser at this step.
   6. If the local backend is running, an additional live sanity check: a throwaway, uncommitted script calling `fetchTasks()` against the real backend, to confirm the axios wiring/base URL/error unwrapping actually work end-to-end — mirrors the backend plan's temporary `CommandLineRunner` checks. Skipped if the backend isn't up at this point; type-checking is the only *required* verification for this step.
   7. Commit: `"Step 3: types and API layer"`.

4. **Routing skeleton**
   1. Placeholder views (`src/views/`): `TaskListView.vue`, `ProjectsView.vue`, `TagsView.vue` — each just a heading for now (e.g. "Tasks"), so navigation can be proven before any real feature code exists. Placeholders are used instead of the real views since those depend on stores/components not built until later steps (step 5+); building them now would mean either stubbing out half their dependencies or pulling later steps forward, collapsing the step-by-step plan.
   2. `src/router/index.ts`: three routes (`/` → `TaskListView`, `/projects` → `ProjectsView`, `/tags` → `TagsView`), using `createWebHistory(import.meta.env.BASE_URL)`.
   3. Wire Pinia and the router into the app in `src/main.ts` (`app.use(createPinia())`, `app.use(router)`) — Pinia was installed as a dependency in step 1 but never actually registered with the app until now.
   4. `App.vue`: replace the Vite starter content (`<HelloWorld />`) with a simple nav bar (`<RouterLink>` to `/`, `/projects`, `/tags`) and a `<RouterView />`. Remove the now-unused starter boilerplate (`src/components/HelloWorld.vue`, `src/assets/hero.png`, `vite.svg`, `vue.svg`) since nothing will reference them anymore.
   5. Verify: `npm run build` to type-check, then run the dev server and actually click through each nav link in a browser — confirm the URL changes, the correct placeholder view renders, and refreshing the page on `/projects` or `/tags` doesn't 404 (the standard SPA history-mode gotcha).
   6. Commit: `"Step 4: routing skeleton"`.

5. **Read-only task list**
   1. `src/stores/tasks.ts` (Pinia, setup style) — read-only for now: `tasks`, `isLoading`, `error` refs, `loadTasks()` calling `fetchTasks()` and catching `ApiError`. No filters, create/edit/delete/complete actions yet — those come in steps 6–8.
   2. `src/components/tasks/TaskItem.vue` — displays one task's title, description, due date, and priority; project/tag ids shown raw for now (resolving to names comes once projects/tags stores exist in step 9). Pure display, no buttons yet.
   3. `src/components/tasks/TaskList.vue` — iterates `tasksStore.tasks`, renders a `TaskItem` per task, shows an empty-state message when the list is empty.
   4. `TaskListView.vue`: replace the step-4 placeholder heading with real content — call `tasksStore.loadTasks()` in `onMounted`, show a loading indicator while `isLoading`, an error message if `error` is set, otherwise `<TaskList>`.
   5. Verify: this is the first step touching real data end-to-end through the browser, and the first real test of the CORS fix just applied on the backend. Seed a couple of tasks directly via a throwaway script/curl against the backend (no create UI exists yet), load the frontend in a browser, confirm the tasks render with correct fields, and check the browser console/Network tab for a successful `GET /api/tasks` with no CORS errors. Clean up the seeded tasks afterward via curl.
   6. Commit: `"Step 5: read-only task list"`.

6. **Task CRUD**
   1. `src/components/common/Modal.vue` — generic reusable modal wrapper (overlay + centered box + close-on-backdrop-click), used by `TaskForm` and later `ConfirmDialog`.
   2. `src/components/common/ConfirmDialog.vue` — generic yes/no confirmation dialog for destructive actions, reused later for project/tag delete (step 9).
   3. `src/components/tasks/TaskForm.vue` — inside `Modal`, for both create and edit. Fields: title (required), description, due date, priority. Project/tag fields are deliberately left out for now (deferred to step 9, once real project/tag stores exist to select from — a numeric-id input would just be thrown-away UI). Takes an optional `task` prop: `null` = create mode, a `Task` = edit mode (pre-fills fields). Client-side validation mirrors the backend's rule (title required/non-blank) before submitting.
   4. Extend `src/stores/tasks.ts` with real mutations: `addTask(payload)`, `editTask(id, payload)`, `removeTask(id)`, each calling the corresponding `src/api/tasks.ts` function then reloading `tasks`.
   5. Wire into the UI: an "Add task" button in `TaskListView.vue` opens `TaskForm` in create mode; each `TaskItem` gets "Edit" (opens `TaskForm` pre-filled) and "Delete" (opens `ConfirmDialog`, then calls `removeTask`) buttons.
   6. Verify: through the real UI. Automated via a throwaway Playwright script (`npx -p playwright node <script>.js`, browser installed once via `npx playwright install chromium`) — kept entirely outside the project (not added to `package.json`, not committed), the same way earlier steps used throwaway curl/node sanity checks. The script drives headless Chromium against the local dev server to: create a task via the form, assert a blank title shows a validation error and doesn't submit, edit the task and confirm the change persists after a reload (proves it hits `PUT`, not just local state), delete it via the confirm dialog, and confirm it's gone after a reload too.
   7. Commit: `"Step 6: task CRUD"`.

7. **Completion toggle and overdue styling**
   1. Extend `src/stores/tasks.ts` with `toggleComplete(task)`, calling the dedicated `PATCH /complete`/`/incomplete` endpoints (`completeTask`/`incompleteTask` in `src/api/tasks.ts`) rather than a full `PUT` — matching the API's own design. Patches the single task in place from the response instead of a full `loadTasks()` reload.
   2. `TaskItem.vue`: add a checkbox bound to `task.completed`, emitting a `toggle-complete` event (same pattern as `edit`/`delete`) rather than calling the store directly, keeping the component presentation-only.
   3. Visual styling in `TaskItem.vue`: completed tasks get a strikethrough/muted title; overdue tasks (`task.overdue`, server-computed, never recomputed client-side) get their due date highlighted (e.g. red/bold). A completed task is never `overdue` per the API's own definition, so no conflicting state to handle.
   4. Wire the event through `TaskList.vue` into `TaskListView.vue`, calling `tasksStore.toggleComplete(task)`.
   5. Verify: via the same throwaway Playwright approach as step 6 — create a task, toggle complete, confirm strikethrough styling and that it persists after reload (proves it hits the `PATCH` endpoint); toggle back to incomplete and confirm styling reverts; create a task with a past due date, confirm overdue styling appears, and confirm it disappears once marked complete. Clean up test tasks afterward.
   6. Commit: `"Step 7: completion toggle and overdue styling"`.

8. **Filters, sorting, and search**
   1. Extend `src/stores/tasks.ts` with a `filters` ref (default `{ sortBy: 'dueDate', sortDir: 'asc' }`) and `setFilters(partial)`, which merges into `filters` and re-fetches via `loadTasks()`. `loadTasks()` now passes `filters.value` to `fetchTasks()` instead of no args — server-side filtering/sorting, using the query params the API already supports, rather than duplicating filter logic client-side.
   2. `src/components/tasks/FilterBar.vue`: status select (All/Incomplete/Completed), priority select (All/Low/Medium/High), a debounced (~300ms) search text input, and sort controls (`sortBy`: due date/priority/created; `sortDir`: ascending/descending). Project/tag filters are deliberately left out for now, same reasoning as step 6's form — they need real project/tag data to populate from, which comes in step 9.
   3. Wire `FilterBar` into `TaskListView.vue`, above the task list, calling `tasksStore.setFilters(...)` on each change.
   4. Verify: via Playwright — seed tasks with varying priority/completed/dueDate, confirm each filter (status, priority) and a search term produce the expected list and the correct query param on the request; confirm sortBy/sortDir actually change the rendered order; confirm rapid typing in search fires only one request after the debounce, not one per keystroke. Clean up seeded tasks afterward.
   5. Commit: `"Step 8: filters, sorting, and search"`.

9. **Projects and tags CRUD**
   1. `src/stores/projects.ts` / `src/stores/tags.ts` (Pinia, setup style): `items`, `isLoading`, `error`, `loadAll()`, `create(payload)`, `rename(id, payload)`, `remove(id)`. `remove` also reloads the tasks store afterward, since deleting a project/tag changes tasks server-side (unassigns project, drops the tag from `tagIds`) and any currently-rendered task list would otherwise show stale data.
   2. `src/components/projects/ProjectManager.vue` — list with inline rename (click-to-edit) and delete (via the existing `ConfirmDialog`), plus an "add new" input. `src/components/tags/TagManager.vue` mirrors this exactly for tags.
   3. Wire into the existing placeholder views: `ProjectsView.vue`/`TagsView.vue` call `loadAll()` in `onMounted` and render the corresponding manager component.
   4. Fill in the project/tag pieces deferred from steps 6 and 8: `TaskForm.vue` gets a project select (options from `projectsStore.items`, plus a "None" option for `projectId: null`) and a tag multi-select/checkboxes (from `tagsStore.items`); `FilterBar.vue` gets project and tag filter selects from the same data; `TaskItem.vue` resolves `projectId`/`tagIds` to actual names instead of showing raw ids (needs `TaskListView.vue` to load the projects/tags stores alongside tasks in `onMounted`).
   5. Verify: via Playwright — create a project and a tag, confirm they appear in both `TaskForm`'s dropdowns and `FilterBar`'s filters; assign a task to them and confirm `TaskItem` shows resolved names, not raw ids; delete the project and confirm the task's project shows as unassigned afterward rather than erroring (matches the API's documented cascade behavior); same check deleting a tag. Clean up test data afterward.
   6. Commit: `"Step 9: projects and tags CRUD"`.

## Working agreement

- Implement **one step at a time**.
- After finishing a step, stop, summarize what was created/changed and why, and wait for the developer to review before continuing.
- Keep code readable and avoid skipping ahead into later steps.
