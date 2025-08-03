// Blog functionality
class BlogManager {
    constructor() {
        this.posts = [];
        this.categories = [];
        this.tags = [];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.filteredPosts = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.init();
    }

    async init() {
        try {
            await this.loadBlogData();
            this.setupEventListeners();
            
            // Initialize based on current page
            if (window.location.pathname.includes('blog/index.html') || window.location.pathname.endsWith('blog/')) {
                this.initBlogIndex();
            }
        } catch (error) {
            console.error('Failed to initialize blog:', error);
            this.showError('Failed to load blog data');
        }
    }

    async loadBlogData() {
        const response = await fetch('./data/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.posts = data.posts.filter(post => post.published);
        this.categories = data.categories;
        this.tags = data.tags;
        this.filteredPosts = [...this.posts];
    }

    initBlogIndex() {
        this.renderPosts();
        this.renderSidebar();
        this.renderFilters();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterPosts();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterPosts();
            });
        }

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    filterPosts() {
        this.filteredPosts = this.posts.filter(post => {
            const matchesCategory = this.currentFilter === 'all' || 
                                  post.category.toLowerCase() === this.currentFilter.toLowerCase();
            
            const matchesSearch = this.searchTerm === '' || 
                                post.title.toLowerCase().includes(this.searchTerm) ||
                                post.summary.toLowerCase().includes(this.searchTerm) ||
                                post.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });
        
        this.currentPage = 1;
        this.renderPosts();
        this.renderPagination();
    }

    renderPosts() {
        const postsContainer = document.getElementById('blogPosts');
        if (!postsContainer) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        if (postsToShow.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">No posts found matching your criteria.</div>';
            return;
        }

        const postsHTML = postsToShow.map(post => this.renderPostCard(post)).join('');
        postsContainer.innerHTML = postsHTML;
    }

    renderPostCard(post) {
        const postDate = new Date(post.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tagsHTML = post.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        return `
            <article class="post-card ${post.featured ? 'featured' : ''}">
                <div class="post-card-content">
                    <div class="post-meta">
                        <span class="post-date">${postDate}</span>
                        <span class="post-category">${post.category}</span>
                        <span class="post-read-time">${post.readTime} min read</span>
                    </div>
                    
                    <h2 class="post-card-title">
                        <a href="post.html?post=${post.slug}">${post.title}</a>
                    </h2>
                    
                    <p class="post-card-summary">${post.summary}</p>
                    
                    <div class="post-card-tags">
                        ${tagsHTML}
                    </div>
                    
                    <div class="post-card-footer">
                        <a href="post.html?post=${post.slug}" class="read-more">Read More →</a>
                        ${post.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    </div>
                </div>
            </article>
        `;
    }

    renderSidebar() {
        this.renderCategories();
        this.renderTags();
        this.renderRecentPosts();
    }

    renderCategories() {
        const categoriesList = document.getElementById('categoriesList');
        if (!categoriesList) return;

        const categoriesHTML = this.categories.map(category => 
            `<li><a href="#" data-category="${category.slug}" class="category-link">${category.name} (${category.count})</a></li>`
        ).join('');

        categoriesList.innerHTML = categoriesHTML;

        // Add click event listeners
        categoriesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-link')) {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.setFilter(category);
            }
        });
    }

    renderTags() {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return;

        const tagsHTML = this.tags.map(tag => 
            `<span class="tag-link" data-tag="${tag.name}">${tag.name}</span>`
        ).join('');

        tagsList.innerHTML = tagsHTML;

        // Add click event listeners
        tagsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-link')) {
                const tag = e.target.dataset.tag;
                this.searchTerm = tag;
                document.getElementById('searchInput').value = tag;
                this.filterPosts();
            }
        });
    }

    renderRecentPosts() {
        const recentPostsList = document.getElementById('recentPosts');
        if (!recentPostsList) return;

        const recentPosts = this.posts
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, 5);

        const recentPostsHTML = recentPosts.map(post => 
            `<li><a href="post.html?post=${post.slug}">${post.title}</a></li>`
        ).join('');

        recentPostsList.innerHTML = recentPostsHTML;
    }

    renderFilters() {
        const categoryFilters = document.getElementById('categoryFilters');
        if (!categoryFilters) return;

        const filtersHTML = this.categories.map(category => 
            `<button class="filter-btn" data-filter="${category.slug}">${category.name}</button>`
        ).join('');

        categoryFilters.innerHTML = filtersHTML;

        // Add click event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter || 'all';
                this.setFilter(filter);
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterPosts();
    }

    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage - 1}">← Previous</button>`;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" data-page="${i}">${i}</button>`;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Next →</button>`;
        }

        paginationContainer.innerHTML = paginationHTML;

        // Add click event listeners
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn')) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderPosts();
                    this.renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }

    showError(message) {
        const container = document.getElementById('blogPosts') || document.body;
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Individual blog post functionality
async function loadBlogPost(slug) {
    try {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const postContent = document.getElementById('postContent');

        // Show loading state
        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        postContent.style.display = 'none';

        // Load post data
        const response = await fetch(`./data/posts/${slug}.json`);
        if (!response.ok) {
            throw new Error('Post not found');
        }

        const post = await response.json();
        
        // Update page metadata
        updatePageMetadata(post);
        
        // Render post content
        renderPostContent(post);
        
        // Setup post functionality
        setupPostFunctionality(post);
        
        // Load related posts
        await loadRelatedPosts(post);
        
        // Generate table of contents
        generateTableOfContents();
        
        // Setup reading progress
        setupReadingProgress();

        // Show post content
        loadingState.style.display = 'none';
        postContent.style.display = 'block';

    } catch (error) {
        console.error('Error loading post:', error);
        showError();
    }
}

function updatePageMetadata(post) {
    document.title = `${post.title} - Franco's Blog`;
    document.getElementById('pageTitle').content = `${post.title} - Franco's Blog`;
    document.getElementById('pageDescription').content = post.seo.metaDescription;
    document.getElementById('pageKeywords').content = post.seo.keywords.join(', ');
    
    // Open Graph
    document.getElementById('ogTitle').content = post.title;
    document.getElementById('ogDescription').content = post.seo.metaDescription;
    document.getElementById('ogUrl').content = window.location.href;
    
    // Twitter Card
    document.getElementById('twitterTitle').content = post.title;
    document.getElementById('twitterDescription').content = post.seo.metaDescription;
}

function renderPostContent(post) {
    const postDate = new Date(post.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update post header
    document.getElementById('breadcrumbTitle').textContent = post.title;
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postDate').textContent = postDate;
    document.getElementById('postReadTime').textContent = `${post.readTime} min read`;
    document.getElementById('postCategory').textContent = post.category;

    // Render tags
    const tagsContainer = document.getElementById('postTags');
    const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    tagsContainer.innerHTML = tagsHTML;

    // Render post content
    document.getElementById('postBody').innerHTML = post.content;
}

function setupPostFunctionality(post) {
    // Social sharing
    setupSocialSharing(post);
}

function setupSocialSharing(post) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.summary);

    document.getElementById('shareTwitter').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
    });

    document.getElementById('shareLinkedIn').addEventListener('click', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    });

    document.getElementById('shareEmail').addEventListener('click', () => {
        window.location.href = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
    });
}

async function loadRelatedPosts(currentPost) {
    try {
        const response = await fetch('./data/posts.json');
        const data = await response.json();
        
        const relatedPosts = data.posts
            .filter(post => post.id !== currentPost.id && post.published)
            .filter(post => 
                post.category === currentPost.category ||
                post.tags.some(tag => currentPost.tags.includes(tag))
            )
            .slice(0, 3);

        const relatedPostsList = document.getElementById('relatedPosts');
        if (relatedPosts.length > 0) {
            const relatedHTML = relatedPosts.map(post => 
                `<li><a href="post.html?post=${post.slug}">${post.title}</a></li>`
            ).join('');
            relatedPostsList.innerHTML = relatedHTML;
        } else {
            relatedPostsList.innerHTML = '<li>No related posts found.</li>';
        }
    } catch (error) {
        console.error('Error loading related posts:', error);
    }
}

function generateTableOfContents() {
    const postContent = document.getElementById('postBody');
    const tocContainer = document.getElementById('tableOfContents');
    const headings = postContent.querySelectorAll('h2, h3, h4');

    if (headings.length === 0) {
        tocContainer.innerHTML = '<p>No headings found.</p>';
        return;
    }

    let tocHTML = '<ul>';
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const level = heading.tagName.toLowerCase();
        const indent = level === 'h3' ? 'toc-indent-1' : level === 'h4' ? 'toc-indent-2' : '';
        
        tocHTML += `<li class="${indent}"><a href="#${id}">${heading.textContent}</a></li>`;
    });
    tocHTML += '</ul>';

    tocContainer.innerHTML = tocHTML;
}

function setupReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    const postContent = document.getElementById('postBody');
    
    window.addEventListener('scroll', () => {
        const contentHeight = postContent.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        const contentTop = postContent.offsetTop;
        
        const scrollDistance = scrollTop - contentTop;
        const scrollableDistance = contentHeight - windowHeight;
        
        if (scrollDistance <= 0) {
            progressBar.style.width = '0%';
        } else if (scrollDistance >= scrollableDistance) {
            progressBar.style.width = '100%';
        } else {
            const progress = (scrollDistance / scrollableDistance) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });
}

function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.getElementById('postContent').style.display = 'none';
}

// Initialize blog manager
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize BlogManager on blog pages
    if (window.location.pathname.includes('blog')) {
        new BlogManager();
    }
});