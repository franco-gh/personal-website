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

# Process markdown files to JSON
resource "null_resource" "process_markdown" {
  triggers = {
    # Trigger when content files change
    content_hash = sha256(join("", [for f in fileset("${path.module}/../content/posts", "*.md") : filesha256("${path.module}/../content/posts/${f}")]))
  }

  provisioner "local-exec" {
    working_dir = "${path.module}/.."
    interpreter = ["/bin/bash", "-c"]
    command = "set -e && if ! command -v node >/dev/null 2>&1; then echo 'Installing Node.js...' && curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs; else echo 'Node.js already installed:' $(node --version); fi && if ! command -v npm >/dev/null 2>&1; then echo 'npm not found, something went wrong with Node.js installation' && exit 1; fi && echo 'Installing npm dependencies...' && npm ci && echo 'Processing markdown files...' && npm run build && echo '✅ Markdown processing complete'"
  }
}

# Upload website files to storage account
resource "null_resource" "upload_website_files" {
  depends_on = [
    azurerm_storage_account_static_website.sa_static_web,
    null_resource.process_markdown
  ]

  triggers = {
    # Trigger re-upload when any source files change
    source_hash = filebase64sha256("${path.module}/../source/index.html")
    # Also trigger when content changes (after processing)
    content_hash = null_resource.process_markdown.triggers.content_hash
  }

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command = "set -e && if ! command -v az >/dev/null 2>&1; then echo 'Installing Azure CLI...' && curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash; else echo 'Azure CLI already installed:' $(az version --query '\"azure-cli\"' -o tsv); fi && echo 'Uploading website files to Azure Storage...' && az storage blob upload-batch --account-name ${azurerm_storage_account.sa-website.name} --account-key ${azurerm_storage_account.sa-website.primary_access_key} --destination '$$web' --source '${path.module}/../source' --overwrite && echo '✅ Website files uploaded successfully'"
  }

}

## triggering
