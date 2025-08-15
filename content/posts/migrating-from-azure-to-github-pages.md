---
title: "Migrating from Azure to GitHub Pages: A Developer's Journey"
date: "2025-01-15"
author: "Franco"
category: "DevOps"
tags: ["github-pages", "azure", "migration", "static-sites", "ci-cd", "automation"]
featured: true
published: true
description: "How I successfully migrated my personal website from Azure Storage Static Websites to GitHub Pages, simplifying deployment and reducing costs."
keywords: ["github pages", "azure migration", "static website hosting", "ci/cd", "terraform", "github actions"]
readTime: 8
---

# Migrating from Azure to GitHub Pages: A Developer's Journey

Today I want to share the story of migrating my personal website from Azure Storage Static Websites to GitHub Pages. What started as a cost optimization exercise turned into a valuable lesson about choosing the right tools for the job.

## The Original Setup

My website was initially hosted on Azure using a sophisticated setup:

- **Infrastructure**: Terraform for Infrastructure as Code
- **Hosting**: Azure Storage Account with Static Website hosting
- **Deployment**: GitHub Actions + Terraform Cloud
- **Content**: Markdown-to-JSON processing for the blog system

While this setup worked well, it had some complexities:

```yaml
# Original workflow complexity
Azure CLI → Terraform → Storage Account → File Upload → Website
```

## Why Migrate?

Several factors motivated the migration:

### 1. **Simplicity Over Complexity**
The Azure setup required managing:
- Service principals and authentication
- Terraform state management
- Azure Storage configurations
- Multiple deployment steps

### 2. **Cost Optimization**
GitHub Pages is free for public repositories, while Azure Storage (though minimal) still incurred costs.

### 3. **Better Integration**
GitHub Pages integrates seamlessly with GitHub repositories, eliminating the need for external authentication.

### 4. **Maintenance Overhead**
The Terraform configuration required periodic updates and maintenance that didn't add value to a simple static site.

## The Migration Process

### Step 1: Remove Azure Infrastructure

```bash
# Removed all Terraform files
rm -rf terraform/
rm scripts/setup-*.sh
rm TERRAFORM-CLOUD-SETUP.md
```

### Step 2: Create GitHub Actions Workflow

I created a new workflow that combines blog processing and GitHub Pages deployment:

```yaml
# .github/workflows/deploy-github-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Process blog posts
        run: |
          npm ci
          npm run build
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./source

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### Step 3: Update Documentation

Updated all documentation to reflect the new GitHub Pages architecture, removing references to Azure and Terraform.

## Benefits Realized

### 🚀 **Simplified Deployment**
```yaml
# New streamlined workflow
Git Push → GitHub Actions → Process Content → Deploy to Pages
```

### 💰 **Cost Savings**
- **Before**: ~$2-5/month for Azure Storage
- **After**: $0 (GitHub Pages is free for public repos)

### 🔧 **Reduced Maintenance**
- No more Terraform state management
- No Azure authentication concerns
- Automatic SSL certificates
- Built-in CDN

### ⚡ **Better Developer Experience**
- Single platform (GitHub) for code, issues, and hosting
- Automatic deployments on push
- Easy rollbacks through Git history
- Built-in deployment logs

## Key Learnings

### 1. **Right Tool for the Job**
Sometimes the "enterprise" solution isn't necessary for simple use cases. GitHub Pages is perfect for static sites.

### 2. **Complexity Has a Cost**
Every additional service, authentication method, and deployment step adds maintenance overhead.

### 3. **Platform Integration Matters**
Using GitHub for both code repository and hosting creates a seamless workflow.

### 4. **Don't Over-Engineer**
My blog doesn't need the complexity of Infrastructure as Code when a simple GitHub Actions workflow suffices.

## The New Architecture

```mermaid
graph LR
    A[Write Markdown] --> B[Git Push]
    B --> C[GitHub Actions]
    C --> D[Process Content]
    D --> E[Deploy to Pages]
    E --> F[Live Website]
```

**Technology Stack:**
- **Source**: GitHub Repository
- **Processing**: Node.js + GitHub Actions
- **Hosting**: GitHub Pages
- **Domain**: Custom domain with automatic SSL
- **CDN**: GitHub's global CDN (included)

## Performance Comparison

| Metric | Azure Setup | GitHub Pages |
|--------|-------------|--------------|
| Build Time | 3-5 minutes | 2-3 minutes |
| SSL Setup | Manual | Automatic |
| CDN | Additional cost | Included |
| Custom Domain | Manual DNS | Simple CNAME |
| Deployment Complexity | High | Low |

## Conclusion

This migration reinforced an important principle: **choose simplicity when it serves your needs**. While Azure Storage with Terraform was a great learning experience, GitHub Pages provides everything I need for a personal website with significantly less complexity.

The migration took about 2 hours and resulted in:
- ✅ Lower costs (free hosting)
- ✅ Simplified deployment
- ✅ Better integration
- ✅ Reduced maintenance
- ✅ Same performance and features

Sometimes the best architecture is the simplest one that meets your requirements.

## What's Next?

With the infrastructure simplified, I can focus on what matters most: creating content and improving the user experience. The time saved on infrastructure maintenance can now be invested in writing better blog posts and enhancing the website's features.

Have you ever over-engineered a solution only to realize simpler was better? I'd love to hear your stories in the comments!

---

*This post was written during the live migration process. The website you're reading this on is now proudly hosted on GitHub Pages! 🎉*