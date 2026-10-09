# Terraform state is LOCAL for this project (the default -- no `backend`
# block below means state lives in a terraform.tfstate file on disk,
# right here in infra/). That file is the single source of truth for
# what Terraform believes exists in GCP; losing it means Terraform loses
# track of resources it created (they'd still exist in GCP, just
# unmanaged). Fine for a solo demo project; a real team setup would use
# a `backend "gcs"` block instead, so state is shared and locked across
# multiple people running terraform -- intentionally out of scope here,
# noted in the README as the first thing to change for team use.
terraform {
  required_version = ">= 1.9.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
