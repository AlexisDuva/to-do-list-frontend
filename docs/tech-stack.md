# Tech Stack — To-Do List Frontend

## Framework

- **Vue 3 (Composition API)** — chosen partly for job-application relevance. Composition API (not Options API) since it's the modern idiomatic style and composes better with TypeScript.

## Build tool

- **Vite** — Vue's standard build tool/dev server; fast hot-reload during development.

## Language

- **TypeScript** — types mirror the backend API contract (`Task`, `Project`, `Tag`, etc.), catching mismatches with the backend at compile time rather than at runtime.

## State management

- **Pinia** — Vue's official state management library. Chosen because task/project/tag data is needed by multiple, non-nested components at once (task list, filter bar, project/tag managers); a shared reactive store avoids duplicated fetches and prop-drilling. Composition-API-native (a store is just a `ref`-based composable) and has devtools support.

## Routing

- **Vue Router** — three top-level views (tasks, projects, tags) as a single-page application; no full page reloads when navigating between them.

## Styling

- **Tailwind CSS** — utility-first CSS, no component library. Chosen over a library like Vuetify/PrimeVue to demonstrate raw component/CSS skill rather than relying on pre-built components.

## HTTP client

- **Axios** — used over the native `fetch` API for its interceptor support, which centralizes unwrapping the backend's uniform error response shape (`{status, error, message, timestamp}`) in one place instead of repeating error handling in every API call.

## Backend integration

- Consumes the existing REST API documented in the backend repo (`to-do-list/docs/api-documentation.md`) — Tasks, Projects, Tags resources.
- The backend must allow the frontend's origin via CORS (frontend and backend run on different origins/ports in dev and different domains in production); this is backend-side configuration, not something the frontend can work around.
- API base URL is read from an env var (`VITE_API_BASE_URL`) so switching between local dev and the deployed backend is a config change, not a code change.

## Deployment

- **Static hosting (Vercel)** — a Vue/Vite build produces static files (HTML/JS/CSS) with no server-side rendering needed; these are served independently of the backend, which remains deployed separately on Railway.
