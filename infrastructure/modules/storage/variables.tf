variable "project_name" {
  type = string
}

variable "env" {
  type = string
}

variable "account_id" {
  type        = string
  description = "Cloudflare account ID"
}

variable "location" {
  type        = string
  description = "R2 location hint (wnam, enam, weur, eeur, apac, oc)"
}

variable "cors_origins" {
  type        = list(string)
  description = "Origins allowed to upload and download files directly from the browser"
}
