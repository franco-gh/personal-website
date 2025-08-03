# Random suffix for storage account name
resource "random_string" "suffix" {
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
  tags                     = var.tags
}

resource "azurerm_storage_account_static_website" "sa_static_web" {
  storage_account_id = azurerm_storage_account.sa-website.id
  index_document     = "index.html"
  error_404_document = "404.html"
}

# Upload website files to storage account
resource "null_resource" "upload_website_files" {
  depends_on = [azurerm_storage_account_static_website.sa_static_web]

  provisioner "local-exec" {
    command = "az storage blob upload-batch --account-name ${azurerm_storage_account.sa-website.name} --account-key ${azurerm_storage_account.sa-website.primary_access_key} --destination '$web' --source '../source' --overwrite"
  }

  # Trigger re-upload when source files change
  triggers = {
    source_content_hash = filemd5("../source/index.html")
  }
}