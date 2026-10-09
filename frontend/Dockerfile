# ---- Stage 1: build ----
# This stage exists only to produce static files (dist/). Node, npm, and
# every node_modules package are dev-time tooling -- none of it needs to
# ship in the final image. Naming it "build" lets stage 2 reference it
# by name instead of by index.
FROM node:20-alpine AS build

WORKDIR /app

# Same caching trick as the backend: copy just the manifests first so the
# `npm ci` layer is cached and skipped on rebuilds unless package.json /
# package-lock.json actually changed.
COPY package.json package-lock.json ./
# `npm ci` (not `npm install`): installs exactly what's in
# package-lock.json, deterministic, and faster in CI/build contexts.
RUN npm ci

COPY . .

# Build-time argument. Unlike an ENV, an ARG is only available during
# `docker build` and is not present in the running container -- which is
# correct here, since Vite bakes VITE_API_BASE_URL into the compiled JS
# bundle at build time (see import.meta.env usage in the Redux slices).
# There's no "changing it later at runtime" for a Vite env var.
ARG VITE_API_BASE_URL
RUN npm run build

# ---- Stage 2: serve ----
# Fresh, minimal image containing only nginx + the compiled static files
# from stage 1. Everything from the build stage (node_modules, source
# files, the Node runtime itself) is left behind -- this is the whole
# point of a multi-stage build: a small, production-only final image.
FROM nginx:alpine

# Copy the built assets out of the "build" stage by name.
COPY --from=build /app/dist /usr/share/nginx/html

# Our own config (listen on 8080, SPA fallback) replaces nginx's default,
# which listens on 80 and has no knowledge of client-side routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
