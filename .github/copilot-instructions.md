# Copilot instructions for python-react-portfolio

## Project layout

This repository is a simple two-part app, not a single monorepo app:

- `backend/` contains the Flask API.
  - `backend/app.py` creates the Flask app and registers the projects blueprint.
  - `backend/routes/projects.py` defines the current `/api/projects` JSON endpoint.
- `frontend/` contains the React + Vite client.
  - `frontend/src/main.jsx` is the app entry point.
  - `frontend/src/App.jsx` is the current UI screen.
  - `vite.config.js` is the Vite config for the frontend.

Keep changes scoped to the correct app directory. There is no root-level package manager or runtime config for this repo.

## Build, lint, and validation commands

Use the project-local commands instead of root-level ones.

- Frontend install:
  - `cd frontend && npm install`
- Start the frontend dev server:
  - `cd frontend && npm run dev`
- Frontend production build:
  - `cd frontend && npm run build`
- Frontend lint:
  - `cd frontend && npm run lint`
- Start the backend dev server:
  - `cd backend && python app.py`

Current repo checks:

- `npm --prefix frontend run lint`
- `npm --prefix frontend run build`

These are the active validation commands in this repo. There is no configured test runner, and no single-test command exists today.

## Architecture and data flow

The app is intentionally small and service-oriented:

- The frontend is a Vite React app that renders from `frontend/src/main.jsx`.
- The backend is a Flask app with a lightweight Blueprint-based API.
- Current backend behavior is a static project list from `backend/routes/projects.py`, returned as JSON from `/api/projects`.
- The frontend and backend are decoupled; UI work should use the API endpoints rather than building data directly into components.
- The project currently has no database layer, ORM, or persistent storage. Most data is hardcoded or derived from the app itself.

The repo also includes `@reduxjs/toolkit` and `react-redux` in the frontend dependencies, but Redux is not currently wired into the app. Avoid introducing Redux state architecture unless the feature genuinely needs it.

## Key conventions specific to this repo

- Keep all frontend-related files under `frontend/` and backend-related files under `backend/`.
- Prefer small, surgical changes over broad refactors; this repo is a compact prototype portfolio site rather than a large application framework.
- Avoid adding new framework/tooling layers (e.g., TypeScript, Jest/Vitest, Prisma, Next.js) unless the task clearly requires them.
- Respect the shell permissions in `.claude/settings.local.json`; the repo is configured with a narrow command allow-list and commands should stay within that scope.
- Generated directories are already ignored by `.gitignore` (`frontend/node_modules`, `frontend/dist`, `backend/venv`, etc.). Do not treat those as source files.
- There are no automated backend tests or frontend tests in the current repo. If a feature needs validation, prefer the smallest relevant command already available instead of inventing a new workflow.

## Practical guidance for future edits

- If you are adding a new API route, place it in `backend/routes/` and register it from `backend/app.py`.
- If you are changing the UI, start from `frontend/src/App.jsx` and keep styling local to the relevant component unless broader app styling is clearly needed.
- If you are modifying the frontend build or tooling, do so only in `frontend/package.json` and `frontend/vite.config.js`.
- When running terminal commands, prefer the existing repo conventions and avoid broad shell access outside the configured allow-list.
