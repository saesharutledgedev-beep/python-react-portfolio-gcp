# No default -- deliberately required. This forces whoever runs
# `terraform plan`/`apply` to explicitly pass the real GCP project ID
# (via -var, a terraform.tfvars file, or an env var), rather than risk
# silently applying against the wrong project because of a default.
variable "project_id" {
  description = "GCP project ID to deploy into"
  type        = string
}

variable "region" {
  description = "GCP region for the cluster and Artifact Registry"
  type        = string
  default     = "us-central1"
}

variable "github_repo" {
  description = "GitHub repo allowed to authenticate via Workload Identity Federation, as owner/repo"
  type        = string
  default     = "saesharutledgedev-beep/python-react-portfolio-gcp"
}

variable "cluster_name" {
  description = "Name of the GKE Autopilot cluster"
  type        = string
  default     = "portfolio-cluster"
}

variable "artifact_repo_name" {
  description = "Name of the Artifact Registry Docker repository"
  type        = string
  default     = "portfolio"
}
