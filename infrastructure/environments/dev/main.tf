terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.5"
    }
  }
  required_version = ">= 1.8.2"
}

module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  env          = var.env
  account_id   = var.account_id
  location     = var.storage_location
  cors_origins = var.storage_cors_origins
}
