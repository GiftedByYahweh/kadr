variable "project_name" {
  type    = string
  default = "kadr"
}

variable "env" {
  type    = string
  default = "dev"
}

variable "account_id" {
  type        = string
  description = "Cloudflare account ID"
}

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  description = "Cloudflare API token with R2 edit permission"
}

variable "storage_location" {
  type    = string
  default = "eeur"
}

variable "storage_cors_origins" {
  type    = list(string)
  default = ["http://localhost:5180"]
}
