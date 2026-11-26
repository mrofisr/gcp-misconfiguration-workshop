output "bucket_name" {
  description = "Name of the lab bucket."
  value       = google_storage_bucket.lab.name
}

output "service_account_email" {
  description = "Email of the lab service account."
  value       = google_service_account.lab.email
}

output "service_name" {
  description = "Name of the Cloud Run service used by the starter app."
  value       = "${var.prefix}-files"
}
