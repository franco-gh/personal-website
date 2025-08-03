#!/bin/bash

# Setup Terraform Backend for Azure Storage
# This script creates the necessary Azure resources for storing Terraform state

set -e

echo "🚀 Setting up Terraform backend..."

# Variables
RESOURCE_GROUP_NAME="terraform-state-rg"
STORAGE_ACCOUNT_NAME="tfstate$(openssl rand -hex 4)"
CONTAINER_NAME="tfstate"
LOCATION="eastus"

# Check if Azure CLI is logged in
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

echo "📋 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP_NAME"
echo "  Storage Account: $STORAGE_ACCOUNT_NAME"
echo "  Container: $CONTAINER_NAME"
echo "  Location: $LOCATION"
echo ""

# Create resource group
echo "🏗️  Creating resource group..."
az group create \
    --name $RESOURCE_GROUP_NAME \
    --location $LOCATION \
    --output table

# Create storage account
echo "💾 Creating storage account..."
az storage account create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --sku Standard_LRS \
    --encryption-services blob \
    --output table

# Create storage container
echo "📦 Creating storage container..."
az storage container create \
    --name $CONTAINER_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --output table

# Get storage account key
echo "🔑 Getting storage account key..."
ACCOUNT_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --query '[0].value' -o tsv)

echo ""
echo "✅ Terraform backend setup complete!"
echo ""
echo "📝 Add the following backend configuration to your terraform/providers.tf:"
echo ""
echo "terraform {"
echo "  backend \"azurerm\" {"
echo "    resource_group_name  = \"$RESOURCE_GROUP_NAME\""
echo "    storage_account_name = \"$STORAGE_ACCOUNT_NAME\""
echo "    container_name       = \"$CONTAINER_NAME\""
echo "    key                  = \"website.tfstate\""
echo "  }"
echo "}"
echo ""
echo "🔐 GitHub Secrets needed:"
echo "TERRAFORM_BACKEND_RESOURCE_GROUP=$RESOURCE_GROUP_NAME"
echo "TERRAFORM_BACKEND_STORAGE_ACCOUNT=$STORAGE_ACCOUNT_NAME"
echo "TERRAFORM_BACKEND_CONTAINER=$CONTAINER_NAME"
echo "TERRAFORM_BACKEND_KEY=website.tfstate"
echo ""
echo "⚠️  Important: Store the storage account key securely for GitHub Actions!"
echo "TERRAFORM_BACKEND_ACCESS_KEY=$ACCOUNT_KEY"