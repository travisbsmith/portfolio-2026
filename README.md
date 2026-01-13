# Travis Smith Portfolio

A modern, fast portfolio website built with Astro. Dark and sophisticated design optimized for showcasing design leadership work.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── public/              # Static assets (images, fonts, CNAME)
│   └── images/
│       ├── work/        # Portfolio project images
│       └── blog/        # Blog post images
├── src/
│   ├── components/      # Reusable UI components
│   ├── content/         # Markdown content
│   │   ├── work/        # Portfolio case studies
│   │   └── blog/        # Blog posts
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   └── styles/          # Global styles
└── .github/
    └── workflows/       # GitHub Actions for deployment
```

## Adding Content

### New Blog Post

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description"
date: 2026-01-15
tags: ["Leadership", "Design"]
draft: false
---

Your content here...
```

### New Work/Project

Create a new `.md` file in `src/content/work/`:

```markdown
---
title: "Project Name"
company: "Company Name"
description: "Brief project description"
date: 2026-01-01
image: "/images/work/project-hero.svg"
tags: ["Product Design", "Leadership"]
featured: true
order: 1
---

## Overview

Project content here...
```

## Deployment

### GitHub Pages Setup

1. Create a new GitHub repository
2. Push this code to the repository
3. Go to Settings > Pages
4. Under "Build and deployment", select "GitHub Actions"
5. The site will deploy automatically on push to `main`

### Custom Domain (Namecheap)

1. In your GitHub repo Settings > Pages, add `fully-operational.com` as custom domain
2. In Namecheap > Domain List > Manage > Advanced DNS, add:

| Type | Host | Value |
|------|------|-------|
| A Record | @ | 185.199.108.153 |
| A Record | @ | 185.199.109.153 |
| A Record | @ | 185.199.110.153 |
| A Record | @ | 185.199.111.153 |
| CNAME | www | yourusername.github.io |

3. Wait 5-30 minutes for DNS propagation
4. Enable "Enforce HTTPS" in GitHub Pages settings

## Making Updates with Cursor

Just describe what you want to change:

- "Add a new blog post about design systems"
- "Update my bio on the about page"
- "Add a new portfolio project for my latest work"
- "Change the accent color to blue"

## Tech Stack

- **Astro** - Static site generator
- **TypeScript** - Type safety
- **CSS** - Custom properties, no framework
- **GitHub Pages** - Free hosting
- **GitHub Actions** - Automated deployment

## License

Private - Travis Smith
