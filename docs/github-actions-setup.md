# GitHub Actions Setup Guide

This guide explains how to set up the automated blog posting and deployment workflow using GitHub Actions with Terraform.

## Overview

The workflow consists of two main GitHub Actions:

1. **Create Blog Post** (`create-blog-post.yml`) - Creates a PR with a new blog post
2. **Deploy Website** (`deploy.yml`) - Deploys the website using Terraform when PRs are merged

## Prerequisites

1. Azure CLI installed and configured
2. GitHub repository with Actions enabled
3. Azure subscription with appropriate permissions

## Setup Steps

### 1. Set up Terraform Backend

Run the backend setup script to create Azure Storage for Terraform state:

```bash
./scripts/setup-terraform-backend.sh
```

This will output the required GitHub secrets.

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Azure Authentication
- `AZURE_CLIENT_ID` - Azure service principal client ID
- `AZURE_CLIENT_SECRET` - Azure service principal client secret  
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID
- `AZURE_TENANT_ID` - Azure tenant ID

#### Terraform Backend (from step 1)
- `TERRAFORM_BACKEND_RESOURCE_GROUP` - Resource group for state storage
- `TERRAFORM_BACKEND_STORAGE_ACCOUNT` - Storage account name for state
- `TERRAFORM_BACKEND_CONTAINER` - Container name (usually "tfstate")
- `TERRAFORM_BACKEND_KEY` - State file key (usually "website.tfstate")
- `TERRAFORM_BACKEND_ACCESS_KEY` - Storage account access key

### 3. Create Azure Service Principal

Create a service principal for GitHub Actions:

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "github-actions-website" \
  --role "Contributor" \
  --scopes "/subscriptions/YOUR_SUBSCRIPTION_ID" \
  --sdk-auth

# The output will provide the values for GitHub secrets
```

### 4. Enable Backend in Terraform

Edit `terraform/providers.tf` and uncomment the backend configuration:

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstateXXXXXXXX"  # Replace with your storage account
    container_name       = "tfstate"
    key                  = "website.tfstate"
  }
}
```

Then migrate your existing state:

```bash
cd terraform
terraform init -migrate-state
```

## Usage

### Creating a New Blog Post

1. Go to the "Actions" tab in your GitHub repository
2. Select "Create Blog Post PR" workflow
3. Click "Run workflow"
4. Fill in the blog post details:
   - **Title**: Your blog post title
   - **Category**: Blog category (default: Technology)
   - **Tags**: Comma-separated tags (default: blog)
   - **Description**: SEO description
5. Click "Run workflow"

This will:
- Create a new markdown file in `content/posts/`
- Generate the JSON files for the blog system
- Create a pull request with the new blog post

### Reviewing and Publishing

1. Review the created pull request
2. Edit the blog post content in the markdown file if needed
3. Merge the pull request when ready

### Automatic Deployment

When you merge a PR to main that contains changes to:
- `content/**` (blog posts)
- `source/**` (website files) 
- `scripts/**` (build scripts)
- `package.json`
- `terraform/**` (infrastructure)

The deploy workflow will automatically:
1. Process markdown files to JSON
2. Run Terraform to update infrastructure
3. Upload files to Azure Storage
4. Verify the deployment

## Workflow Details

### Create Blog Post Workflow

**Trigger**: Manual (workflow_dispatch)
**Permissions**: contents:write, pull-requests:write

**Steps**:
1. Checkout repository
2. Setup Node.js
3. Install dependencies
4. Generate filename from title
5. Create blog post markdown file
6. Process markdown to JSON
7. Create pull request

### Deploy Workflow

**Trigger**: Push to main (with path filters)
**Permissions**: contents:read

**Steps**:
1. Checkout repository
2. Setup Node.js and install dependencies
3. Process markdown to JSON
4. Setup Terraform
5. Initialize Terraform (with remote backend)
6. Plan and apply Terraform changes
7. Verify deployment

## Security Notes

- All sensitive values are stored as GitHub secrets
- The service principal has minimal required permissions
- Terraform state is stored securely in Azure Storage
- Access keys are never exposed in logs

## Troubleshooting

### Backend Configuration Issues
- Ensure all backend secrets are correctly set
- Verify the storage account exists and is accessible
- Check that the service principal has access to the backend storage

### Deployment Failures
- Check the GitHub Actions logs for detailed error messages
- Verify Azure credentials are valid and have sufficient permissions
- Ensure Terraform configuration is valid with `terraform validate`

### File Upload Issues
- Verify the Azure Storage account exists
- Check that the static website feature is enabled
- Ensure the service principal has Storage Blob Data Contributor role

## File Structure

```
.github/workflows/
├── create-blog-post.yml    # Blog post creation workflow
├── deploy.yml              # Deployment workflow
└── blog-build.yml          # Blog processing workflow (existing)

scripts/
└── setup-terraform-backend.sh  # Backend setup script

terraform/
├── main.tf                 # Infrastructure definition
├── providers.tf            # Provider and backend configuration
├── variables.tf            # Variable definitions
├── outputs.tf              # Output definitions
└── terraform.tfvars       # Variable values (local only)
```

## Next Steps

After setup:
1. Test the workflow by creating a blog post
2. Verify deployment works correctly
3. Customize the blog post template as needed
4. Add additional automation as required