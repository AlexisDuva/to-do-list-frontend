# To-Do List — Frontend

Vue 3 frontend for the [to-do-list](https://github.com/AlexisDuva/to-do-list) backend API.

## Docs

- [Tech stack](./docs/tech-stack.md)
- [Implementation plan](./docs/implemention-plan.md)
- [Difficulties encountered](./docs/difficulties.md)

## Prerequisites

- Node.js 20+ and npm
- The [backend](https://github.com/AlexisDuva/to-do-list) running locally (default: `http://localhost:8080`)

## Setup

```bash
npm install
cp .env.example .env   # defaults to VITE_API_BASE_URL=http://localhost:8080/api
```

Edit `.env` if your backend runs elsewhere (e.g. a different port, or the deployed Railway URL).

## Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot reload. The backend must already be running and reachable at `VITE_API_BASE_URL`, and must allow CORS requests from the frontend's origin.

## Build

```bash
npm run build
```

Type-checks the project and produces a static production build in `dist/`.
