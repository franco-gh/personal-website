# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website project consisting of:
- **Static website source**: Located in `source/` directory (HTML, CSS, JavaScript, images)
- **Blog system**: Full-featured blog with Markdown-to-JSON processing
- **Azure infrastructure**: Terraform configuration in `terraform/` directory for hosting on Azure Storage Static Website
- **Automated deployment**: GitHub Actions for content processing and deployment

## Architecture

### Website Structure
- `source/` - Static website files served to users
  - `source/css/` - Stylesheets (main.css, blog.css, responsive.css)
  - `source/js/` - JavaScript files (main.js, blog.js)
  - `source/images/` - Image assets and blog images
  - `source/blog/` - Blog system files
    - `source/blog/index.html` - Blog listing page
    - `source/blog/post.html` - Individual post template
    - `source/blog/data/` - Generated JSON files (auto-generated)
      - `posts.json` - Master post index with metadata
      - `posts/` - Individual post JSON files

### Content Management
- `content/posts/` - Markdown source files for blog posts
- `scripts/process-markdown.js` - Node.js script for Markdown to JSON conversion
- `.github/workflows/` - GitHub Actions for automated processing

### Infrastructure
- **Terraform modules**: All infrastructure is defined in `terraform/` directory
- **Azure Storage Account**: Configured for static website hosting with `index.html` as default and `404.html` for errors
- **Resource naming**: Uses random suffix for storage account uniqueness

## Development Commands

### Blog Content Management
```bash
# Install dependencies
npm install

# Process Markdown files to JSON (manual)
npm run build

# Local development server
npm run dev

# Create new blog post
# 1. Create content/posts/your-post-name.md
# 2. Add frontmatter (title, date, category, tags, etc.)
# 3. Write content in Markdown
# 4. Commit and push - GitHub Actions will process automatically
```

### Terraform Infrastructure
```bash
# Initialize Terraform
cd terraform && terraform init

# Plan infrastructure changes
cd terraform && terraform plan

# Apply infrastructure changes  
cd terraform && terraform apply

# Destroy infrastructure
cd terraform && terraform destroy
```

### Required Variables
Create `terraform/terraform.tfvars` with:
- `subscription_id` - Azure subscription ID
- `location` - Azure region (defaults to "East US")
- `tags` - Resource tags (has defaults)

## Important Files

### Infrastructure
- `terraform/main.tf` - Core Azure resources (Resource Group, Storage Account, Static Website)
- `terraform/variables.tf` - Variable definitions
- `terraform/providers.tf` - Azure provider configuration
- `.gitignore` - Standard Terraform ignore patterns for sensitive files

### Blog System
- `package.json` - Node.js dependencies and scripts
- `scripts/process-markdown.js` - Markdown to JSON conversion script
- `content/posts/*.md` - Blog post source files (Markdown with frontmatter)
- `source/blog/data/posts.json` - Auto-generated master post index
- `source/blog/data/posts/*.json` - Auto-generated individual post files

### Automation
- `.github/workflows/deploy.yml` - Main deployment workflow
- `.github/workflows/blog-build.yml` - Blog content processing workflow

## Blog Post Frontmatter

Each Markdown post should include frontmatter with these fields:
```yaml
---
title: "Post Title"           # Required
date: "2024-08-05"           # Required (YYYY-MM-DD)
author: "Franco"             # Optional (defaults to Franco)
category: "Technology"       # Optional (defaults to Uncategorized)
tags: ["tag1", "tag2"]       # Optional array
featured: true               # Optional boolean
published: true              # Optional (defaults to true)
description: "SEO description" # Optional (auto-generated if missing)
keywords: ["seo", "words"]   # Optional array
readTime: 5                  # Optional (auto-calculated if missing)
---
```

## Automated Workflows

### Content Processing (GitHub Actions)
1. **Trigger**: Push to `main` branch with changes in `content/posts/`
2. **Process**: Convert Markdown files to JSON with metadata
3. **Output**: Updated `source/blog/data/` files
4. **Deploy**: Automatic deployment to Azure Static Web Apps

### Local Development
1. Write posts in `content/posts/` as Markdown files
2. Run `npm run build` to process locally (optional)
3. Run `npm run dev` for local testing
4. Commit and push - automation handles the rest

## Notes

- **Blog system**: Full-featured with search, categories, tags, and responsive design
- **Content workflow**: Write in Markdown, deploy automatically via GitHub Actions
- **Performance**: Client-side rendering with pre-generated JSON for fast loading
- **SEO**: Automatic meta tag generation and structured data support
- **Infrastructure**: Azure Storage Static Website with Terraform IaC
- **Security**: No server-side processing, minimal attack surface