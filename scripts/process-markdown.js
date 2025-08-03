#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const slugify = require('slugify');

// Configure marked for better HTML output
marked.setOptions({
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: true
});

// Custom renderer for better HTML structure
const renderer = new marked.Renderer();

// Custom heading renderer for table of contents
renderer.heading = function(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${escapedText}">${text}</h${level}>`;
};

// Custom code renderer for syntax highlighting
renderer.code = function(code, language) {
    if (language) {
        return `<pre><code class="language-${language}">${code}</code></pre>`;
    }
    return `<pre><code>${code}</code></pre>`;
};

marked.setOptions({ renderer });

class MarkdownProcessor {
    constructor() {
        this.contentDir = path.join(process.cwd(), 'content', 'posts');
        this.outputDir = path.join(process.cwd(), 'source', 'blog', 'data');
        this.postsOutputDir = path.join(this.outputDir, 'posts');
        
        // Ensure output directories exist
        this.ensureDirectoryExists(this.outputDir);
        this.ensureDirectoryExists(this.postsOutputDir);
    }

    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    // Generate reading time estimate
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    // Generate slug from title
    generateSlug(title) {
        return slugify(title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }

    // Extract excerpt from content
    generateExcerpt(content, maxLength = 160) {
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>/g, '');
        
        if (plainText.length <= maxLength) {
            return plainText;
        }
        
        // Find the last complete sentence within the limit
        const truncated = plainText.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf('.');
        
        if (lastSentence > maxLength * 0.8) {
            return truncated.substring(0, lastSentence + 1);
        }
        
        // If no good sentence break, just truncate at word boundary
        const lastSpace = truncated.lastIndexOf(' ');
        return truncated.substring(0, lastSpace) + '...';
    }

    // Process a single markdown file
    processMarkdownFile(filePath) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data: frontmatter, content } = matter(fileContent);
            
            // Validate required frontmatter
            if (!frontmatter.title) {
                console.warn(`Warning: ${filePath} missing title in frontmatter`);
                return null;
            }
            
            // Generate HTML content
            const htmlContent = marked(content);
            
            // Generate slug if not provided
            const slug = frontmatter.slug || this.generateSlug(frontmatter.title);
            
            // Calculate reading time
            const readTime = frontmatter.readTime || this.calculateReadingTime(content);
            
            // Generate excerpt if not provided
            const summary = frontmatter.summary || frontmatter.excerpt || this.generateExcerpt(htmlContent);
            
            // Get file creation/modification dates
            const stats = fs.statSync(filePath);
            const publishDate = frontmatter.date ? new Date(frontmatter.date).toISOString().split('T')[0] : 
                               stats.birthtime.toISOString().split('T')[0];
            const lastModified = frontmatter.lastModified ? new Date(frontmatter.lastModified).toISOString().split('T')[0] : 
                                stats.mtime.toISOString().split('T')[0];
            
            // Create post object
            const post = {
                id: slug,
                title: frontmatter.title,
                slug: slug,
                publishDate: publishDate,
                lastModified: lastModified,
                author: frontmatter.author || 'Franco',
                summary: summary,
                tags: frontmatter.tags || [],
                category: frontmatter.category || 'Uncategorized',
                readTime: readTime,
                featured: frontmatter.featured || false,
                published: frontmatter.published !== false, // Default to true unless explicitly false
                content: htmlContent,
                seo: {
                    metaDescription: frontmatter.description || summary,
                    keywords: frontmatter.keywords || frontmatter.tags || []
                }
            };
            
            return post;
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error.message);
            return null;
        }
    }

    // Get all markdown files from content directory
    getMarkdownFiles() {
        if (!fs.existsSync(this.contentDir)) {
            console.log(`Content directory ${this.contentDir} does not exist. Creating it...`);
            this.ensureDirectoryExists(this.contentDir);
            return [];
        }
        
        return fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.contentDir, file));
    }

    // Generate categories and tags statistics
    generateMetadata(posts) {
        const categories = {};
        const tags = {};
        
        posts.forEach(post => {
            // Count categories
            if (post.category) {
                categories[post.category] = (categories[post.category] || 0) + 1;
            }
            
            // Count tags
            post.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });
        
        return {
            categories: Object.keys(categories).map(name => ({
                name: name,
                slug: this.generateSlug(name),
                count: categories[name]
            })),
            tags: Object.keys(tags).map(name => ({
                name: name,
                count: tags[name]
            }))
        };
    }

    // Main processing function
    async process() {
        console.log('🚀 Starting markdown processing...');
        
        const markdownFiles = this.getMarkdownFiles();
        
        if (markdownFiles.length === 0) {
            console.log('ℹ️  No markdown files found in content/posts directory');
            return;
        }
        
        console.log(`📄 Found ${markdownFiles.length} markdown files`);
        
        // Process all markdown files
        const posts = [];
        
        for (const filePath of markdownFiles) {
            console.log(`🔄 Processing: ${path.basename(filePath)}`);
            const post = this.processMarkdownFile(filePath);
            
            if (post) {
                posts.push(post);
                
                // Write individual post JSON file
                const postFilePath = path.join(this.postsOutputDir, `${post.slug}.json`);
                fs.writeFileSync(postFilePath, JSON.stringify(post, null, 2));
                console.log(`✅ Generated: ${postFilePath}`);
            }
        }
        
        if (posts.length === 0) {
            console.log('⚠️  No valid posts were processed');
            return;
        }
        
        // Sort posts by publish date (newest first)
        posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        
        // Generate metadata
        const metadata = this.generateMetadata(posts);
        
        // Create master posts.json file
        const masterData = {
            posts: posts.map(post => ({
                id: post.id,
                title: post.title,
                slug: post.slug,
                publishDate: post.publishDate,
                lastModified: post.lastModified,
                author: post.author,
                summary: post.summary,
                tags: post.tags,
                category: post.category,
                readTime: post.readTime,
                featured: post.featured,
                published: post.published,
                seo: post.seo
            })),
            categories: metadata.categories,
            tags: metadata.tags
        };
        
        const masterFilePath = path.join(this.outputDir, 'posts.json');
        fs.writeFileSync(masterFilePath, JSON.stringify(masterData, null, 2));
        
        console.log(`✅ Generated master file: ${masterFilePath}`);
        console.log(`🎉 Successfully processed ${posts.length} posts!`);
        
        // Log summary
        console.log('\n📊 Summary:');
        console.log(`   • Posts: ${posts.length}`);
        console.log(`   • Categories: ${metadata.categories.length}`);
        console.log(`   • Tags: ${metadata.tags.length}`);
        console.log(`   • Published: ${posts.filter(p => p.published).length}`);
        console.log(`   • Featured: ${posts.filter(p => p.featured).length}`);
    }
}

// CLI usage
if (require.main === module) {
    const processor = new MarkdownProcessor();
    processor.process().catch(error => {
        console.error('❌ Error processing markdown files:', error);
        process.exit(1);
    });
}

module.exports = MarkdownProcessor;