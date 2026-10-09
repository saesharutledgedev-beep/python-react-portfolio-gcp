# --- Workload Identity Federation (WIF) ---
# The alternative to this is a downloaded JSON service account key,
# pasted into a GitHub Actions secret. That key is a long-lived static
# credential -- if it ever leaks (a logged workflow run, a misconfigured
# repo, a compromised Action), whoever has it can authenticate as that
# service account indefinitely, from anywhere, until someone notices and
# manually revokes it.
#
# WIF instead lets GCP trust GitHub's own OIDC tokens directly. Every
# GitHub Actions run already gets a short-lived, auto-generated identity
# token proving "this is workflow run #N on repo X". We configure GCP to
# accept that token, for this repo specifically, and exchange it for
# temporary GCP credentials -- no static secret exists anywhere to leak
# in the first place, and the trust is scoped to one named GitHub repo.

# The "pool" is the container that holds one or more external identity
# providers GCP is willing to trust.
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub Actions Pool"

  depends_on = [google_project_service.iam_credentials]
}

# The "provider" within that pool tells GCP specifically how to validate
# and interpret GitHub's OIDC tokens.
resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id         = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Actions Provider"

  # GitHub's own OIDC token issuer -- this is what signs the tokens each
  # workflow run gets, and what GCP verifies the signature against.
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  # Maps claims inside GitHub's token to attributes GCP's IAM can
  # reference. `assertion.repository` is a claim GitHub includes
  # automatically (e.g. "saesharutledgedev-beep/python-react-portfolio-gcp").
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  # The critical scoping step: without this, ANY GitHub repo anywhere
  # could present a token to this provider. This restricts it to tokens
  # whose `repository` claim exactly matches our repo.
  attribute_condition = "assertion.repository == '${var.github_repo}'"

  depends_on = [google_iam_workload_identity_pool.github_pool]
}

# The GCP identity that GitHub Actions impersonates -- this is the
# "user" the workflow effectively runs as once authenticated. Separate
# from your own personal GCP identity entirely.
resource "google_service_account" "github_actions_deployer" {
  account_id   = "github-actions-deployer"
  display_name = "GitHub Actions Deployer"
}

# Grants the WIF pool (scoped to our repo, via the same
# attribute.repository condition) permission to impersonate the service
# account above. This is the actual trust link: "tokens from this repo,
# via this pool, may act as this service account."
resource "google_service_account_iam_member" "workload_identity_binding" {
  service_account_id = google_service_account.github_actions_deployer.name
  role                = "roles/iam.workloadIdentityUser"
  member              = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repo}"
}

# What the deployer service account is actually allowed to DO once
# impersonated -- least privilege: push images, and interact with GKE.
# Nothing broader (no project-owner, no ability to touch unrelated
# resources).
resource "google_project_iam_member" "deployer_artifact_registry" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
}

resource "google_project_iam_member" "deployer_gke" {
  project = var.project_id
  role    = "roles/container.developer"
  member  = "serviceAccount:${google_service_account.github_actions_deployer.email}"
}
