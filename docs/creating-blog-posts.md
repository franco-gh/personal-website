# Creating Blog Posts - Quick Reference Guide

This guide explains how to create new blog posts for your personal website hosted on GitHub Pages.

## Quick Start

1. **Create new Markdown file** in `content/posts/`
2. **Add frontmatter** with required metadata
3. **Write content** in Markdown
4. **Commit and push** - GitHub Actions handles the rest!

## File Structure

```
content/posts/
└── your-post-name.md          # Your new post (Markdown with frontmatter)

source/blog/data/
├── posts.json                 # Auto-generated master index
└── posts/
    └── your-post-name.json    # Auto-generated individual post file
```

## Step-by-Step Instructions

### 1. Create the Markdown File

Create a new file in `content/posts/` with a descriptive filename:

```bash
# Good filename examples:
content/posts/introduction-to-react-hooks.md
content/posts/deploying-nodejs-apps-to-production.md
content/posts/my-journey-with-typescript.md

# Bad filename examples (avoid spaces, special characters):
content/posts/my new post!.md
content/posts/React & Node.js.md
```

### 2. Add Frontmatter

Start your file with YAML frontmatter between `---` markers:

```yaml
---
title: "Your Post Title Here"
date: "2025-01-15"
author: "Franco"
category: "Technology"
tags: ["javascript", "react", "web-development"]
featured: true
published: true
description: "A compelling description for SEO and social sharing"
keywords: ["react", "hooks", "javascript", "frontend"]
readTime: 5
---
```

### 3. Write Your Content

After the frontmatter, write your content in standard Markdown:

```markdown
# Your Post Title

Your introduction paragraph here...

## Section Headers

Use `##` for main sections, `###` for subsections.

### Code Examples

\```javascript
const example = () => {
  console.log("Hello, world!");
};
\```

### Lists and Links

- Bullet point 1
- Bullet point 2
- [Link to external site](https://example.com)

**Bold text** and *italic text* work as expected.
```

## Frontmatter Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | String | Post title (quoted) | `"My Amazing Post"` |
| `date` | String | Publication date (YYYY-MM-DD) | `"2025-01-15"` |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `author` | String | `"Franco"` | Author name |
| `category` | String | `"Uncategorized"` | Post category |
| `tags` | Array | `[]` | List of tags |
| `featured` | Boolean | `false` | Show on featured posts |
| `published` | Boolean | `true` | Published or draft |
| `description` | String | Auto-generated | SEO meta description |
| `keywords` | Array | Auto-generated | SEO keywords |
| `readTime` | Number | Auto-calculated | Reading time in minutes |

### Categories

Use these consistent categories:

- `"Technology"` - Tech tutorials, programming
- `"Personal"` - Personal thoughts, experiences
- `"DevOps"` - Infrastructure, deployment, tools
- `"Design"` - UI/UX, design thinking
- `"Career"` - Professional development

### Tags

Use descriptive, lowercase tags with hyphens:

**Good tags:**
- `javascript`, `react`, `nodejs`
- `web-development`, `machine-learning`
- `github-actions`, `static-sites`

**Avoid:**
- `JavaScript` (use lowercase)
- `web development` (use hyphens)
- `js` (use full words when possible)

## Markdown Features Supported

### Basic Formatting

```markdown
**Bold text**
*Italic text*
`Inline code`
[Link text](https://example.com)
```

### Code Blocks

````markdown
```javascript
// Syntax highlighting supported
const greeting = "Hello, world!";
console.log(greeting);
```

```bash
# Shell commands
npm install
npm run build
```
````

### Lists

```markdown
1. Numbered list item
2. Another numbered item

- Bullet point
- Another bullet point
  - Nested bullet point
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Images

```markdown
![Alt text](path/to/image.jpg)
![Blog image](/images/blog/my-image.jpg)
```

**Note:** Place images in `source/images/blog/` directory.

## Publishing Workflow

### Local Testing (Optional)

```bash
# Install dependencies (first time only)
npm install

# Process markdown files locally
npm run build

# Start local server for testing
npm run dev
# Visit http://localhost:3000
```

### Publishing to Live Site

```bash
# Add your new post
git add content/posts/your-new-post.md

# Commit with descriptive message
git commit -m "Add new blog post: Your Post Title"

# Push to trigger deployment
git push origin main
```

**GitHub Actions will automatically:**
1. Process your Markdown to JSON
2. Generate updated blog index
3. Deploy to GitHub Pages
4. Make your post live at your custom domain

## File Naming Convention

Use descriptive, URL-friendly filenames:

```bash
# Good examples:
building-responsive-websites.md
introduction-to-docker-containers.md
my-experience-with-remote-work.md

# The system will generate clean URLs like:
# /blog/post.html?id=building-responsive-websites
# /blog/post.html?id=introduction-to-docker-containers
```

## Tips and Best Practices

### Writing Tips

1. **Start with an engaging opening** - Hook readers in the first paragraph
2. **Use descriptive headings** - Help readers scan your content
3. **Include code examples** - Make technical posts actionable
4. **Add a conclusion** - Summarize key takeaways
5. **Proofread before publishing** - Check spelling and grammar

### SEO Optimization

1. **Write compelling descriptions** - Used for social sharing and search results
2. **Choose relevant keywords** - Help people find your content
3. **Use descriptive titles** - Be specific and keyword-rich
4. **Add appropriate tags** - Improve content discoverability

### Technical Tips

1. **Test locally first** - Run `npm run dev` to preview
2. **Check generated JSON** - Ensure metadata looks correct
3. **Validate dates** - Use YYYY-MM-DD format consistently
4. **Keep filenames clean** - Avoid spaces and special characters

## Troubleshooting

### Common Issues

**Problem:** Build fails with parsing error
**Solution:** Check your frontmatter YAML syntax - ensure proper quotes and indentation

**Problem:** Images don't show up
**Solution:** Place images in `source/images/blog/` and use paths like `/images/blog/filename.jpg`

**Problem:** Post doesn't appear on site
**Solution:** Check that `published: true` in frontmatter and that you've pushed to main branch

**Problem:** Date shows incorrectly
**Solution:** Use YYYY-MM-DD format in quotes: `date: "2025-01-15"`

### Getting Help

If you encounter issues:

1. Check the GitHub Actions logs in the repository's Actions tab
2. Verify your Markdown syntax with a Markdown linter
3. Test locally with `npm run build` to see error messages
4. Check that all required frontmatter fields are present

## Example Complete Post

```markdown
---
title: "Getting Started with React Hooks"
date: "2025-01-15"
author: "Franco"
category: "Technology"
tags: ["react", "javascript", "hooks", "frontend"]
featured: true
published: true
description: "Learn how to use React Hooks to manage state and side effects in functional components"
keywords: ["react hooks", "useState", "useEffect", "functional components"]
readTime: 7
---

# Getting Started with React Hooks

React Hooks revolutionized how we write React components by bringing state and lifecycle methods to functional components. In this post, we'll explore the most commonly used hooks and how to implement them effectively.

## What Are React Hooks?

Hooks are functions that let you "hook into" React features from functional components...

## The useState Hook

The `useState` hook lets you add state to functional components:

\```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\```

## Conclusion

React Hooks provide a more intuitive way to manage state and side effects in functional components. Start with `useState` and `useEffect`, then explore more advanced hooks as your needs grow.

Happy coding! 🚀
```

---

**Remember:** Every push to main branch triggers automatic deployment. Your new post will be live within 2-3 minutes!