# Content Management Guide

This site uses **Astro** with **Markdown** for content management. No database required—all content lives in files that you can edit directly.

## Quick Reference

| Content Type | Location | Format |
|--------------|----------|--------|
| Work/Case Studies | `src/content/work/` | Markdown (`.md`) |
| Blog Posts | `src/content/blog/` | Markdown (`.md`) |
| Site Pages | `src/pages/` | Astro (`.astro`) |
| Images | `public/images/` | JPG, PNG, GIF, SVG |

---

## Adding a New Blog Post

1. Create a new `.md` file in `src/content/blog/`
2. Use this template:

```markdown
---
title: "Your Post Title"
description: "A brief description for previews and SEO"
date: 2026-01-15
tags: ["Design Leadership", "Product Strategy"]
draft: false
---

Your content goes here. Write in Markdown.

## Headings work like this

Regular paragraphs just flow naturally.

- Bullet points
- Work too

> Blockquotes for emphasis
```

3. Save and the site will rebuild automatically

### Blog Post Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The post title |
| `description` | Yes | Short description for SEO and previews |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `tags` | No | Array of topic tags |
| `draft` | No | Set to `true` to hide from site |

---

## Adding a New Work/Case Study

1. Create a new `.md` file in `src/content/work/`
2. Use this template:

```markdown
---
title: "Project Title"
company: "Company Name"
description: "Brief description for the card preview"
date: 2024-01-01
image: "/images/work/project-hero.jpg"
tags: ["Product Design", "Mobile"]
order: 1
---

## Overview

**Role:** Your role on the project

Description of the project and your contributions...

## The Challenge

What problem were you solving?

## The Solution

How did you approach it?

![Image description](/images/work/project-screenshot.jpg)

## Results

- Key metric improvement
- Another achievement
- Business impact
```

### Work Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Project title |
| `company` | Yes | Company/client name |
| `description` | Yes | Short description for cards |
| `date` | Yes | Project date |
| `image` | Yes | Hero image path |
| `tags` | No | Array of skill/category tags |
| `order` | No | Display order (1 = first) |

---

## Adding Images

1. Add images to `public/images/` (organized by folder)
2. Reference them in Markdown with `/images/path/to/image.jpg`

### Image Best Practices

- **Hero images:** 1600×900px or larger, JPG
- **Content images:** 1200px wide max, JPG or PNG
- **Optimize:** Use tools like [Squoosh](https://squoosh.app) to compress

---

## Editing Pages

Static pages like About and Contact are in `src/pages/`. These use Astro components and can be edited directly.

### Key Files

- `src/pages/about.astro` — About page content
- `src/pages/contact.astro` — Contact information
- `src/pages/index.astro` — Homepage

---

## Using with Cursor + Claude

### Common Commands

**"Add a new blog post about [topic]"**
Claude will create the Markdown file with proper frontmatter.

**"Update my work experience"**
Claude will edit `src/pages/about.astro` to update the timeline.

**"Add a new case study for [project]"**
Claude will create a new Markdown file in `src/content/work/`.

**"Change the homepage headline"**
Claude will edit `src/pages/index.astro`.

### Tips

1. Be specific about what you want to change
2. Mention file paths if you know them
3. Ask Claude to preview changes before committing

---

## Building and Deploying

```bash
# Development (local preview)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The site auto-deploys to GitHub Pages when you push to `main`.

---

## File Structure

```
src/
├── content/
│   ├── blog/          # Blog posts (Markdown)
│   └── work/          # Case studies (Markdown)
├── pages/
│   ├── index.astro    # Homepage
│   ├── about.astro    # About page
│   ├── contact.astro  # Contact page
│   ├── blog/          # Blog routes
│   └── work/          # Work routes
├── components/        # Reusable components
├── layouts/           # Page layouts
└── styles/            # Global styles

public/
└── images/            # Static images
    ├── about/         # About page images
    └── work/          # Work/case study images
```

---

## Need Help?

Just ask Claude in Cursor! Common requests:

- "How do I add a new blog post?"
- "Update my job title to [new title]"
- "Add this image to my case study"
- "Change the accent color"
