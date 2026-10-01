# These four values are exactly what gets wired into GitHub Actions as
# repo secrets/variables after `terraform apply` (task #12) -- CI needs
# them to know WHERE to push images, WHICH cluster to deploy to, and HOW
# to authenticate via WIF instead of a key file.

output "workload_identity_provider" {
  description = "Full resource name of the WIF provider -- used by google-github-actions/auth in deploy.yml"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "deployer_service_account_email" {
  description = "Service account GitHub Actions impersonates via WIF"
  value       = google_service_account.github_actions_deployer.email
}

output "artifact_registry_repository" {
  description = "Full Artifact Registry path images get pushed to, e.g. <region>-docker.pkg.dev/<project>/<repo>"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.portfolio.repository_id}"
}

output "cluster_name" {
  description = "GKE Autopilot cluster name -- used by get-gke-credentials in deploy.yml"
  value       = google_container_cluster.primary.name
}

output "cluster_region" {
  value = var.region
}
