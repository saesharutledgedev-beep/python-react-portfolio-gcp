# GCP APIs are off by default per-project -- Terraform can't create a
# GKE cluster, push to Artifact Registry, etc. until these are explicitly
# enabled. Each resource below depends on the relevant API being enabled
# first (via `depends_on`), so Terraform orders them correctly instead of
# racing to create the cluster before container.googleapis.com is ready.
resource "google_project_service" "container" {
  project            = var.project_id
  service            = "container.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry" {
  project            = var.project_id
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam_credentials" {
  project            = var.project_id
  service            = "iamcredentials.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sts" {
  project            = var.project_id
  service            = "sts.googleapis.com"
  disable_on_destroy = false
}

# Autopilot vs the older "Standard" GKE mode: Standard has you choose
# machine types, node counts, and manage node upgrades/scaling yourself.
# Autopilot removes all of that -- Google manages the nodes entirely, you
# just describe what pods need (which is exactly what the
# resources.requests/limits in k8s/ are for), and billing is per-pod
# resource usage rather than per-node. Trades some low-level control for
# much less operational surface area -- a reasonable default for a solo
# demo project, and a deliberate talking point for why it was chosen
# over Standard.
resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region

  enable_autopilot = true

  # Without this, `terraform destroy` refuses to delete the cluster --
  # a safety rail meant for production clusters. This is a throwaway
  # demo project we fully intend to be able to tear down cleanly, so
  # it's turned off here.
  deletion_protection = false

  depends_on = [google_project_service.container]
}

# Artifact Registry is Google's current container registry product
# (the older "Container Registry" / gcr.io is being phased out). This is
# where CI (deploy.yml) pushes built images, and where the k8s
# Deployments' image: fields will point once CI replaces the
# backend:latest / frontend:latest placeholders.
resource "google_artifact_registry_repository" "portfolio" {
  location      = var.region
  repository_id = var.artifact_repo_name
  format        = "DOCKER"

  depends_on = [google_project_service.artifact_registry]
}
