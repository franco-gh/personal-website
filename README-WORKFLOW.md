# Automated Blog Workflow

This project implements a fully automated blog posting and deployment workflow using GitHub Actions and Terraform.

## 🎯 Workflow Overview

```mermaid
graph LR
    A[Write Blog Post] --> B[Create PR via GitHub Action]
    B --> C[Review & Edit Post]
    C --> D[Merge PR]
    D --> E[Auto-Deploy via Terraform]
    E --> F[Live Website]
```

## 🚀 Quick Start

### 1. Create a New Blog Post
1. Go to **Actions** tab in GitHub
2. Select **"Create Blog Post PR"**
3. Click **"Run workflow"**
4. Fill in details:
   - Title: "My Amazing Post"
   - Category: "Technology" 
   - Tags: "web,development,azure"
   - Description: "A post about amazing things"

### 2. Review and Publish
1. GitHub automatically creates a PR with your post
2. Edit the generated markdown file in `content/posts/`
3. Review the generated JSON files
4. Merge the PR when ready

### 3. Automatic Deployment
- Terraform deploys the updated content
- Website automatically updates with new post
- Deployment verification ensures it's working

## 📁 Project Structure

```
/
├── .github/workflows/           # GitHub Actions
│   ├── create-blog-post.yml    # Blog post creation
│   ├── deploy.yml              # Terraform deployment  
│   └── blog-build.yml          # Blog processing
├── content/posts/              # Markdown source files
├── source/                     # Static website files
│   └── blog/data/             # Generated JSON files
├── terraform/                  # Infrastructure as Code
├── scripts/                   # Automation scripts
└── docs/                      # Documentation
```

## 🔧 Components

### Blog Creation Workflow
- **Trigger**: Manual workflow dispatch
- **Creates**: Markdown file with frontmatter template
- **Generates**: JSON files for blog system
- **Output**: Pull request with new blog post

### Deployment Workflow  
- **Trigger**: Push to main branch
- **Path Filters**: Only runs for relevant changes
- **Process**: 
  1. Processes markdown → JSON
  2. Runs Terraform plan/apply
  3. Uploads files to Azure Storage
  4. Verifies deployment

### Infrastructure
- **Terraform**: Manages Azure Storage and Static Website
- **State Management**: Remote backend in Azure Storage
- **File Upload**: Automated via Terraform provisioner
- **Content Types**: Properly set for all file types

## 🛠️ Setup Required

1. **Run setup scripts**:
   ```bash
   ./scripts/setup-github-secrets.sh    # Azure credentials
   ./scripts/setup-terraform-backend.sh # Terraform state
   ```

2. **Configure GitHub Secrets**:
   - Azure authentication credentials
   - Terraform backend configuration

3. **Enable backend in Terraform**:
   - Uncomment backend config in `terraform/providers.tf`
   - Run `terraform init -migrate-state`

## 🎯 Features

### ✅ Fully Automated
- No manual file uploads
- No manual infrastructure management
- Consistent deployment process

### ✅ State Management
- Terraform state in Azure Storage
- Prevents state conflicts
- Team collaboration ready

### ✅ Content Processing
- Markdown → JSON conversion
- SEO metadata generation
- Blog index creation

### ✅ Error Handling
- Deployment verification
- Rollback capabilities
- Clear error reporting

## 🔍 Monitoring

- **GitHub Actions**: View workflow runs and logs
- **Terraform Outputs**: Website URL and resource info
- **Azure Portal**: Monitor storage and costs
- **Website**: Automatic accessibility testing

## 🚨 Troubleshooting

### Common Issues

**Deployment fails**: Check Azure credentials and permissions
**State conflicts**: Ensure backend is properly configured  
**Upload errors**: Verify storage account exists and is accessible
**Blog not updating**: Check markdown processing in workflow logs

### Debug Steps

1. Check GitHub Actions logs
2. Verify Terraform plan output
3. Test Azure CLI authentication
4. Validate file uploads in storage account

## 📚 Documentation

- `docs/github-actions-setup.md` - Detailed setup guide
- `scripts/` - Helper scripts with comments
- `terraform/` - Infrastructure documentation
- GitHub Actions - Inline documentation in YAML files

## 🎉 Benefits

- **Zero-touch deployment**: Write → Review → Merge → Live
- **Version control**: All content and infrastructure versioned
- **Collaboration**: Multiple authors via PR workflow  
- **Reliability**: Consistent, repeatable deployments
- **Cost-effective**: Azure Storage static hosting
- **Scalable**: Easy to add features and automation

---

🚀 **Ready to blog!** Just run the "Create Blog Post PR" action to get started.