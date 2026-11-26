variable "project_id" {
  type        = string
  description = "Lab project ID provided by the organizer."
}

variable "prefix" {
  type        = string
  default     = "gdg-semarang-lab"
  description = "Unique prefix for bucket, service account, and service names."
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "Region for the lab resources."
}
