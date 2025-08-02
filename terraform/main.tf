# Random suffix for storage account name
resource "random_string" "storage_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "azurerm_resource_group" "rg-website" {
  name     = "website-rg"
  location = var.location
}

resource "azurerm_storage_account" "sa-website" {
  name                     = "website${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.rg-website.name
  location                 = azurerm_resource_group.rg-website.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags = vars.tags
}

resource "azurerm_storage_account_static_website" "sa_static_web" {
  storage_account_id = azurerm_storage_account.sa-website.id
  index_document     = "index.html"
  error_404_document = "404.html"
}