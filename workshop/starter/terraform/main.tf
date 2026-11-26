# INTENTIONALLY VULNERABLE — do not use this configuration outside the lab.

resource "google_storage_bucket" "lab" {
  name                        = "${var.prefix}-files"
  location                    = upper(var.region)
  force_destroy               = true
  uniform_bucket_level_access = true

  # VULNERABILITY 1: public access prevention is not enforced.
  public_access_prevention = "inherited"
}

# VULNERABILITY 2: anyone on the internet can read the bucket.
resource "google_storage_bucket_iam_member" "public_viewer" {
  bucket = google_storage_bucket.lab.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# VULNERABILITY 3: the app's robot user has far more access than it needs.
resource "google_service_account" "lab" {
  account_id   = "${var.prefix}-sa"
  display_name = "Lab app service account (intentionally over-permissive)"
}

resource "google_project_iam_member" "lab_owner" {
  project = var.project_id
  role    = "roles/owner"
  member  = "serviceAccount:${google_service_account.lab.email}"
}

# VULNERABILITY 4: a downloadable long-lived key for the robot user.
resource "google_service_account_key" "lab_key" {
  service_account_id = google_service_account.lab.name
}
