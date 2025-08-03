# Personal Website with Blog

A modern, fast, and scalable personal website with an integrated blog system. Built with static site generation, automated content processing, and Infrastructure as Code.

## 🌟 Features

### Website
- **Modern responsive design** that works on all devices
- **Fast loading** with optimized assets and efficient code
- **Professional layout** with home, blog, and contact pages
- **SEO optimized** with proper meta tags and structured data

### Blog System
- **Write in Markdown** with frontmatter for metadata
- **Automated processing** from Markdown to JSON via GitHub Actions
- **Client-side search** and filtering without server requirements
- **Category and tag system** for content organization
- **Reading time estimation** and featured post support
- **Social sharing** integration (Twitter, LinkedIn, email)
- **Responsive design** optimized for reading

### Infrastructure
- **Azure Storage** static website hosting for reliability and performance
- **Terraform** Infrastructure as Code for reproducible deployments
- **GitHub Actions** for automated content processing and deployment
- **Cost-effective** hosting (~$3/month for full functionality)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Azure subscription
- Terraform installed
- GitHub repository

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo>
   cd personal-website
   npm install
   ```

2. **Process blog content**
   ```bash
   npm run build    # Convert Markdown to JSON
   npm run dev      # Start local development server
   ```

3. **View locally**
   - Open http://localhost:3000
   - Browse the blog at http://localhost:3000/blog/

### Create Your First Blog Post

1. **Create a new Markdown file**
   ```bash
   touch content/posts/my-first-post.md
   ```

2. **Add frontmatter and content**
   ```markdown
   ---
   title: "My First Blog Post"
   date: "2024-08-05"
   category: "Personal"
   tags: ["intro", "blog"]
   featured: true
   description: "My introduction to blogging"
   ---

   # My First Blog Post

   Welcome to my blog! Here's what I want to share...
   ```

3. **Process and view**
   ```bash
   npm run build    # Convert to JSON
   npm run dev      # Start server and view
   ```

## 📁 Project Structure

```
personal-website/
├── .github/workflows/          # GitHub Actions automation
│   ├── blog-build.yml         # Blog content processing
│   └── deploy.yml             # Full deployment pipeline
├── content/posts/             # Markdown blog posts (source)
├── scripts/                   # Build and processing scripts
│   └── process-markdown.js    # Markdown to JSON converter
├── source/                    # Static website files (deployed)
│   ├── blog/                  # Blog system
│   │   ├── index.html         # Blog listing page
│   │   ├── post.html          # Individual post template
│   │   └── data/              # Generated JSON files
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript functionality
│   ├── images/                # Image assets
│   ├── index.html             # Homepage
│   ├── contact.html           # Contact/resume page
│   └── 404.html               # Error page
├── terraform/                 # Infrastructure as Code
│   ├── main.tf                # Core Azure resources
│   ├── variables.tf           # Variable definitions
│   ├── providers.tf           # Azure provider config
│   └── terraform.tfvars       # Environment variables
├── package.json               # Node.js dependencies
└── CLAUDE.md                  # Development documentation
```

## 🔧 Deployment

### Azure Infrastructure Setup

1. **Configure Terraform variables**
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit with your Azure subscription ID
   ```

2. **Deploy infrastructure**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

### GitHub Actions Setup

1. **Configure repository secrets**
   - `AZURE_CLIENT_ID` - Service principal client ID
   - `AZURE_CLIENT_SECRET` - Service principal secret
   - `AZURE_SUBSCRIPTION_ID` - Azure subscription ID
   - `AZURE_TENANT_ID` - Azure tenant ID
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` - Static Web Apps deployment token

2. **Automatic deployment**
   - Push to `main` branch triggers full deployment
   - Changes to `content/posts/` trigger blog processing
   - Pull requests show preview with processing results

## ✍️ Content Management

### Writing Blog Posts

Create Markdown files in `content/posts/` with this frontmatter structure:

```yaml
---
title: "Post Title"              # Required
date: "2024-08-05"              # Required (YYYY-MM-DD)
author: "Your Name"             # Optional (defaults to Franco)
category: "Technology"          # Optional
tags: ["tag1", "tag2"]          # Optional array
featured: true                  # Optional boolean
published: true                 # Optional (defaults to true)
description: "SEO description"  # Optional (auto-generated)
keywords: ["seo", "keywords"]   # Optional array
readTime: 5                     # Optional (auto-calculated)
---

# Your content here

Write your post content in Markdown...
```

### Supported Markdown Features

- **Headers** (H1-H6) with automatic ID generation
- **Code blocks** with syntax highlighting
- **Lists** (ordered and unordered)
- **Links** and images
- **Tables** and blockquotes
- **Bold**, *italic*, and `inline code`
- **GitHub Flavored Markdown** extensions

### Automated Processing

When you commit Markdown files, GitHub Actions automatically:

1. **Converts** Markdown to HTML
2. **Generates** reading time estimates
3. **Creates** SEO-friendly excerpts
4. **Updates** category and tag metadata
5. **Optimizes** content for search and filtering
6. **Deploys** to your live site

## 🎨 Customization

### Styling
- Edit `source/css/main.css` for global styles
- Edit `source/css/blog.css` for blog-specific styles
- Edit `source/css/responsive.css` for mobile optimizations

### Content
- Update `source/index.html` for homepage content
- Update `source/contact.html` for your resume/contact info
- Replace social media placeholders with your actual links

### Configuration
- Edit `scripts/process-markdown.js` for custom processing logic
- Modify `.github/workflows/` for custom automation
- Update `terraform/` for infrastructure changes

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Features
- **Static file serving** for maximum speed
- **Client-side search** without server dependencies
- **Responsive images** and lazy loading
- **Minified CSS and JavaScript**
- **Efficient caching** headers
- **CDN-ready** architecture

## 💰 Cost Estimation

### Azure Hosting (Monthly)
- **Storage Account**: ~$0.50 (25GB)
- **Bandwidth**: ~$2.00 (23GB outbound)
- **Transactions**: ~$0.10 (250K operations)
- **Total**: ~$2.60/month

### GitHub Actions
- **Public repositories**: Free
- **Private repositories**: 2000 minutes/month free

## 🔒 Security

### Security Features
- **Static files only** - no server-side vulnerabilities
- **HTTPS by default** with Azure Static Web Apps
- **No database** or user authentication to compromise
- **Infrastructure as Code** for consistent, auditable deployments
- **Automated updates** via GitHub Actions

### Best Practices
- Terraform state stored securely
- Secrets managed via GitHub repository secrets
- No sensitive data in source code
- Regular dependency updates via Dependabot

## 🛠️ Development

### Available Scripts
```bash
npm run build    # Process Markdown files to JSON
npm run dev      # Build and start local development server
npm test         # Run tests (placeholder)
npm run lint     # Run linting (placeholder)
```

### Adding Features
1. **New pages**: Add HTML files to `source/`
2. **Blog features**: Modify `source/js/blog.js`
3. **Processing logic**: Edit `scripts/process-markdown.js`
4. **Automation**: Update `.github/workflows/`

## 📚 Learning Resources

This project demonstrates several modern web development concepts:

- **Static Site Generation** with performance benefits
- **Infrastructure as Code** with Terraform
- **CI/CD pipelines** with GitHub Actions
- **Client-side JavaScript** for dynamic features
- **Content management** without traditional CMS
- **Cloud hosting** with Azure services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a template for your own website!

## 🔗 Links

- **Live Website**: [Your website URL]
- **Blog**: [Your website URL]/blog/
- **Repository**: [GitHub repository URL]
- **Documentation**: See `CLAUDE.md` for detailed development notes

---

Built with ❤️ using modern web technologies and cloud infrastructure.