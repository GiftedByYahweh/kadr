terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

locals {
  cors_max_age_seconds = 3600
}

resource "cloudflare_r2_bucket" "media" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.env}"
  location   = var.location
}

resource "cloudflare_r2_bucket_cors" "media" {
  account_id  = var.account_id
  bucket_name = cloudflare_r2_bucket.media.name

  rules = [
    {
      allowed = {
        methods = ["PUT", "GET"]
        origins = var.cors_origins
        headers = ["content-type"]
      }
      max_age_seconds = local.cors_max_age_seconds
    }
  ]
}
