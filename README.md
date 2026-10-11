# python-react-portfolio-gcp

A personal portfolio site (Flask + React) deployed to Google Kubernetes Engine
with a full CI/CD pipeline — Docker, Kubernetes, Terraform, and GitHub Actions,
all wired together and running live.

**Live site:** https://srutledge.me

## Why this project exists

I had a technical interview coming up that required GCP experience, and the
most honest way to build real experience fast was to build something real,
deploy it for real, and debug it when it broke for real — not read about it.

This repo started as a duplicate of an existing portfolio app and became a
hands-on relearning project, built in direct collaboration with Claude Code
acting as a tutor rather than an autopilot. Concretely, that meant a real
division of labor, not one party doing the work while the other watched:

- **Claude** wrote the first draft of most files (Dockerfiles, Kubernetes
  manifests, Terraform, GitHub Actions workflows) and explained the
  reasoning behind each one before it went in.
- **I** drove everything hands-on and irreversible myself rather than
  letting it happen automatically: installed and authenticated `gcloud`
  and `terraform`, ran `docker compose up` and `terraform plan`/`apply`
  myself, managed every git commit/PR/merge, created the GCP project,
  configured DNS, and read the real error output from the GKE console and
  GitHub Actions logs rather than taking a summary at face value.
- Several of the real failures along the way were diagnosed together, and
  at least one — a double-prefixed `/api/api` path breaking three sections
  of the live site — I spotted first, directly from the browser console,
  while Claude was still pursuing a different (wrong) theory.

The goal was to leave this project able to explain *why* every piece
exists, not just that it works, and to have actually typed/run enough of
it myself that the explanation isn't borrowed.

## Architecture

```
                                   ┌─────────────────────────────┐
                                   │     GKE Autopilot Cluster    │
                                   │                              │
  Browser ──HTTPS──▶  Ingress ─────┼──▶ Service ──▶ frontend pods │
                      (managed         │              (nginx +     │
                       TLS cert,       │               built React)│
                       path-based      │                           │
                       routing)        ├──▶ Service ──▶ backend pods│
                                   │              (gunicorn +   │
                                   │               Flask)       │
                                   └─────────────────────────────┘
```

- **`/`** on `srutledge.me` routes to the **frontend** Service (static React
  build, served by nginx).
- **`/api`** on the same domain routes to the **backend** Service (Flask API).
- Because both are served from the same origin, the browser never makes a
  cross-origin request to reach the API — CORS is configured anyway (see
  below) so the setup stays resilient if that ever changes.
- The frontend and backend containers never talk to each other directly.
  The browser loads the page from the frontend pods, then the browser itself
  calls the backend pods for data — two independent request paths, stitched
  together by the browser, not by the containers.

### Backend — Flask

- Plain Flask app (`backend/app.py`), one Blueprint per content section
  (`routes/about.py`, `routes/hero.py`, `routes/experience.py`, etc.), each
  serving its own JSON under `/api/<section>`.
- No database — content is defined directly in each route module.
- Runs via **gunicorn** in containers/production (`backend/Dockerfile`);
  Flask's own dev server (`app.run()`) is only used for local
  `python app.py` runs, never in a container.
- `FRONTEND_ORIGIN` is read from an environment variable (default:
  `http://localhost:5173`) and used to configure CORS — the allowed origin
  changes per environment (local dev vs. Docker Compose vs. production)
  without touching code.

### Frontend — Vite + React + Redux

- Vite/React app, Redux Toolkit slices per content section
  (`frontend/src/features/*/`), each fetching its own data on mount.
- `VITE_API_BASE_URL` is a **Vite build-time** environment variable — Vite
  inlines its literal value into the compiled JS bundle via
  `import.meta.env.VITE_API_BASE_URL` when `npm run build` runs. Unlike the
  backend's `FRONTEND_ORIGIN`, this cannot be changed at container runtime;
  it's baked in once, at image-build time, by CI.
- Served in production by **nginx** (`frontend/Dockerfile`, multi-stage:
  a `node:20-alpine` stage builds the static files, a separate
  `nginx:alpine` stage serves them — none of the Node tooling ships in the
  final image). `frontend/nginx.conf` adds a `try_files ... /index.html`
  fallback so client-side routes (`react-router-dom`) don't 404 on refresh.

## Containers

| File | What it produces |
|---|---|
| `backend/Dockerfile` | `python:3.12-slim` + gunicorn, single-stage (Python has no separate build-artifact step the way a compiled or bundled language does) |
| `frontend/Dockerfile` | multi-stage: `node:20-alpine` builds, `nginx:alpine` serves |
| `docker-compose.yml` | wires both together for local dev — stays useful indefinitely for fast iteration, reproducing bugs, and testing config changes before they ever touch the real cluster |

Both Dockerfiles pull their base images via `mirror.gcr.io` (Google's public
Docker Hub mirror) rather than `docker.io` directly — GitHub-hosted CI
runners share IPs across huge numbers of workflows, which hits Docker Hub's
anonymous-pull rate limit often enough to break builds unpredictably. Same
images, same tags, just an unrate-limited source.

Run locally:

```
docker compose up --build
```

Then visit `http://localhost:3000`.

## Kubernetes (`k8s/`)

| File | Purpose |
|---|---|
| `namespace.yaml` | isolates this app's resources (`portfolio` namespace) |
| `backend-deployment.yaml` / `backend-service.yaml` | 2 replicas, resource requests/limits, liveness/readiness probes, internal load-balancing |
| `frontend-deployment.yaml` / `frontend-service.yaml` | same pattern for the frontend |
| `ingress.yaml` | GKE Ingress + `ManagedCertificate` — path-based routing, auto-provisioned/renewed TLS, HTTPS-only |
| `backend-hpa.yaml` | autoscales the backend 2→5 replicas on CPU utilization (frontend is static files behind nginx and doesn't need this) |
| `kustomization.yaml` | ties everything above into one `kubectl apply -k k8s/` |

Resource `requests`/`limits` on every container are **required** by GKE
Autopilot — Autopilot provisions underlying node capacity based on what pods
declare they need, rather than you managing node pools yourself.

Image references in the Deployments are placeholders (`backend:latest`,
`frontend:latest`) — `deploy.yml` rewrites these to the real
Artifact-Registry path + git-SHA tag at deploy time via
`kustomize edit set image`, in a temporary in-memory copy that's never
committed back to the repo.

## Infrastructure (`infra/`, Terraform)

Terraform provisions everything *underneath* the containers and manifests —
the cluster and registry that have to exist before any image can be pushed
or any pod can run.

- **GKE Autopilot cluster** — chosen over the older "Standard" GKE mode
  because Autopilot removes node-pool/machine-type/scaling management
  entirely; you describe what pods need (the `requests`/`limits` above) and
  Google manages the nodes, billing per-pod-resource-usage rather than
  per-node. Less low-level control, dramatically less operational surface
  area — the right tradeoff for a solo project.
- **Artifact Registry** — where CI pushes built images.
- **Workload Identity Federation (WIF)** — lets GitHub Actions authenticate
  to GCP with **no static service-account key** anywhere. GCP trusts
  GitHub's own OIDC-signed identity tokens directly, scoped by an
  `attribute_condition` to this exact repo
  (`saesharutledgedev-beep/python-react-portfolio-gcp`) — chosen over a
  downloaded JSON key because a static key is a long-lived secret that
  can leak and be reused indefinitely; a WIF-issued credential is minted
  fresh per workflow run and expires in about an hour.
- An **Artifact Registry cleanup policy** keeps the 10 most recent versions
  of each image and auto-deletes older ones — no manual maintenance.
- Terraform state is **local** (`infra/terraform.tfstate`, gitignored) —
  deliberately not using a remote GCS backend, since this is a solo
  project. The first thing to change for a team setting would be a
  `backend "gcs"` block, so state is shared/locked across multiple people
  running Terraform instead of living on one laptop.

```
cd infra
terraform init
terraform plan -var="project_id=<your-project-id>"
terraform apply -var="project_id=<your-project-id>"
```

## CI/CD (`.github/workflows/`)

- **`ci.yml`** — runs on every push/PR: lints the frontend (oxlint), builds
  both Docker images (no push). Pure validation, no cloud credentials
  touched at all.
- **`deploy.yml`** — runs only on pushes/merges to `main`:
  1. Authenticates to GCP via WIF (no key file).
  2. Builds and pushes both images to Artifact Registry, tagged by git SHA
     (never `latest` — this is what makes rollback possible: every past
     image stays addressable by its own tag).
  3. Fetches GKE cluster credentials.
  4. Rewrites the image placeholders via `kustomize edit set image`.
  5. `kubectl apply -k k8s/`.
  6. Waits on `kubectl rollout status` for both Deployments, so the
     workflow only reports success once the new pods are actually healthy.

Six GitHub Actions **Variables** (not Secrets — none of these are actually
sensitive) feed `deploy.yml`, all populated from Terraform's outputs:
`GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`,
`GCP_ARTIFACT_REGISTRY`, `GCP_CLUSTER_NAME`, `GCP_CLUSTER_REGION`,
`APP_DOMAIN`.

A code change never triggers Terraform — Terraform only manages
infrastructure (the cluster/registry/IAM existing); redeploying application
code flows entirely through `deploy.yml`, independent of whether the
underlying infrastructure ever changes.

## Rollback

Two options, both relying on images being immutable and SHA-tagged:

- `kubectl rollout undo deployment/backend -n portfolio` — uses Kubernetes'
  own retained rollout history.
- Manually redeploy an older tag — every past image is still sitting in
  Artifact Registry untouched (subject to the cleanup policy's 10-version
  retention).

## What actually went wrong (and got fixed) while building this

Kept deliberately, as a record of real debugging rather than a clean
narrative:

- **GKE node pull permissions**: the first live deploy succeeded through
  every step except pods actually starting — `ImagePullBackOff` /
  `403 Forbidden`. I spotted the actual error text (`ImagePullBackOff`,
  `ErrImagePull`, a `NetworkPluginNotReady` message) directly in the GKE
  console before either of us pulled logs. Root cause, found from there:
  Terraform had granted `artifactregistry.writer` to the CI service
  account (so it could *push*), but never granted any Artifact Registry
  role to the identity GKE nodes use to *pull* images at runtime — a
  completely different service account. Fixed with one additional
  `google_project_iam_member` grant.
- **Docker Hub rate limiting**: CI and the real deploy both failed on
  `FROM python:3.12-slim` with `429 Too Many Requests` — GitHub's shared
  runner IPs get rate-limited by Docker Hub. Fixed by switching both
  Dockerfiles to pull via `mirror.gcr.io` instead of `docker.io` directly.
- **Double API prefix**: the production build-arg set
  `VITE_API_BASE_URL=https://srutledge.me/api`, but every Redux slice
  already appends its own `/api/<section>` — producing
  `/api/api/about` and real 404s in production, invisible locally because
  Docker Compose's `VITE_API_BASE_URL` never included the `/api` suffix in
  the first place. **I caught this one** — noticed the duplicated `/api`
  in the failing request path while Claude was still pursuing a caching
  theory — and traced it back to the build-arg. Fixed by dropping the
  extra `/api` from the workflow.
- **ManagedCertificate status lag**: `kubectl` reported the certificate as
  `Provisioning`/`FailedNotVisible` well after the site was already serving
  correctly over HTTPS with a fully valid, trusted certificate — the
  Kubernetes custom resource's status field simply lagged behind the real
  GCP-side state.
