#!/bin/bash

# Helper script to generate the service principal for GitHub Actions
# This script outputs the JSON needed for GitHub secrets

set -e

echo "🔐 Setting up Azure Service Principal for GitHub Actions..."

# Check if Azure CLI is logged in
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Get current subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo "📋 Using subscription: $SUBSCRIPTION_ID"

# Create service principal
echo "🏗️  Creating service principal..."
SP_OUTPUT=$(az ad sp create-for-rbac \
    --name "github-actions-website-$(date +%s)" \
    --role "Contributor" \
    --scopes "/subscriptions/$SUBSCRIPTION_ID" \
    --sdk-auth)

echo ""
echo "✅ Service principal created successfully!"
echo ""
echo "📝 Add the following secrets to your GitHub repository:"
echo "   (Go to Settings > Secrets and variables > Actions)"
echo ""

# Parse the JSON output
CLIENT_ID=$(echo $SP_OUTPUT | jq -r '.clientId')
CLIENT_SECRET=$(echo $SP_OUTPUT | jq -r '.clientSecret')
TENANT_ID=$(echo $SP_OUTPUT | jq -r '.tenantId')

echo "🔑 GitHub Secrets:"
echo "AZURE_CLIENT_ID=$CLIENT_ID"
echo "AZURE_CLIENT_SECRET=$CLIENT_SECRET"
echo "AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID"
echo "AZURE_TENANT_ID=$TENANT_ID"
echo ""
echo "🔗 For Azure login action, also add:"
echo "AZURE_CREDENTIALS="
echo "$SP_OUTPUT"
echo ""
echo "⚠️  Important: Keep these credentials secure!"
echo "💡 You can also run './scripts/setup-terraform-backend.sh' to get the backend secrets."