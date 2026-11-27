output "bucket_name" {
  value       = cloudflare_r2_bucket.media.name
  description = "STORAGE_BUCKET"
}

output "endpoint" {
  value       = "https://${var.account_id}.r2.cloudflarestorage.com"
  description = "STORAGE_ENDPOINT"
}
