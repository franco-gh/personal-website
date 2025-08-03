output "website_url" {
  description = "Primary URL of the static website"
  value       = azurerm_storage_account.sa-website.primary_web_endpoint
}

output "storage_account_name" {
  description = "Name of the storage account hosting the website"
  value       = azurerm_storage_account.sa-website.name
}

output "resource_group_name" {
  description = "Name of the resource group containing all resources"
  value       = azurerm_resource_group.rg-website.name
}

output "primary_blob_endpoint" {
  description = "Primary blob endpoint URL"
  value       = azurerm_storage_account.sa-website.primary_blob_endpoint
}

output "storage_account_id" {
  description = "Resource ID of the storage account"
  value       = azurerm_storage_account.sa-website.id
}

output "website_endpoints" {
  description = "All website endpoints for the static website"
  value = {
    primary_web_endpoint   = azurerm_storage_account.sa-website.primary_web_endpoint
    secondary_web_endpoint = azurerm_storage_account.sa-website.secondary_web_endpoint
  }
}