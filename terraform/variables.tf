variable "location" {
  description = "The Azure region where resources will be created"
  type        = string
  default     = "eastus"
}

variable "subscription_id" {
  description = "The Azure subscription ID where resources will be created"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
}
