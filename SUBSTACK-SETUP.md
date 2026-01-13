# Substack Setup & Cross-Posting Guide

This guide walks you through setting up Substack as your blog platform and automating cross-posting to LinkedIn and Medium.

---

## Step 1: Create Your Substack

1. Go to [substack.com](https://substack.com) and sign up
2. Choose your publication name (e.g., "Travis Smith" or "Design Leadership")
3. Claim your URL: `travissmith.substack.com` (or your preferred name)
4. Set up your profile with photo and bio
5. Customize your publication settings

### Recommended Settings

- **Publication name:** Travis Smith (or a branded name like "Fully Operational")
- **About:** "Thoughts on design leadership, product strategy, and building great teams."
- **Theme:** Choose a clean, minimal theme that matches your portfolio

---

## Step 2: Update Your Portfolio

Once you have your Substack URL, update it in your portfolio:

**File:** `src/pages/blog/index.astro`

```javascript
// Line 8 - Update with your actual Substack URL
const SUBSTACK_URL = "https://travissmith.substack.com";
```

Also update the `featuredPosts` array with links to your actual Substack posts.

---

## Step 3: Writing on Substack

Substack gives you:

- ✅ **Rich text editor** with formatting, images, embeds
- ✅ **Draft saving** and scheduling
- ✅ **Email delivery** to subscribers
- ✅ **Built-in comments** from subscribers
- ✅ **Analytics** on opens, clicks, subscribers
- ✅ **Mobile app** for reading and writing

### Tips for Design Leaders

1. **Use images generously** - Screenshots, diagrams, process photos
2. **Embed Figma files** - Substack supports iframe embeds
3. **Keep posts scannable** - Use headers, bullets, bold text
4. **Include a CTA** - Ask readers to comment, share, or subscribe

---

## Step 4: Cross-Posting to LinkedIn

### Option A: Manual (Recommended for quality)

1. Publish on Substack first
2. Copy/paste key points to LinkedIn as a post
3. Add "Read the full article: [link]"
4. This actually performs better than auto-posting

### Option B: Automated via Zapier

1. Sign up at [zapier.com](https://zapier.com)
2. Create a new Zap:
   - **Trigger:** RSS Feed → New Item in Feed
   - **RSS URL:** `https://travissmith.substack.com/feed`
   - **Action:** LinkedIn → Create Share Update
3. Customize the post format:
   ```
   New post: {{title}}
   
   {{description}}
   
   Read more: {{link}}
   ```

---

## Step 5: Cross-Posting to Medium

### Option A: Medium Import (One-click)

1. On Medium, go to your profile → Stories → Import a story
2. Paste your Substack post URL
3. Medium will import with formatting intact
4. The canonical URL points back to Substack (good for SEO)

### Option B: Automated via Zapier

1. Create a Zap:
   - **Trigger:** RSS Feed → New Item in Feed
   - **RSS URL:** `https://travissmith.substack.com/feed`
   - **Action:** Medium → Create Story
2. Note: Medium API has limitations; manual import is often better

---

## Step 6: Comments

Substack has native comments for subscribers:

- **Free subscribers** can read and comment
- **Paid subscribers** (if enabled) get premium features
- **You control moderation** from your dashboard

If you want comments on your portfolio site too, you can add:

- **Giscus** - Uses GitHub Discussions (free, developer-friendly)
- **Disqus** - Traditional comment system

For now, directing users to comment on Substack keeps the conversation centralized.

---

## Workflow Summary

```
┌─────────────────┐
│  Write on       │
│  Substack       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auto-emails    │
│  subscribers    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│LinkedIn│ │Medium │
│(manual │ │(import│
│ or Zap)│ │ tool) │
└───────┘ └───────┘
         │
         ▼
┌─────────────────┐
│  Portfolio blog │
│  links to posts │
└─────────────────┘
```

---

## Your RSS Feed

Once you have posts, your Substack RSS feed will be at:

```
https://travissmith.substack.com/feed
```

This feed can be used for:
- Zapier automations
- Portfolio site integration (fetch recent posts)
- Podcast apps (if you add audio)

---

## Advanced: Auto-Fetch Posts on Portfolio

If you want your portfolio to automatically show your latest Substack posts, I can add an RSS parser. Just ask!

This would:
1. Fetch your Substack RSS feed at build time
2. Display the latest 5 posts on your blog page
3. Auto-update when you rebuild the site

---

## Questions?

Just ask Claude in Cursor:
- "Update my Substack URL to [new URL]"
- "Add RSS auto-fetching for my blog posts"
- "Set up Giscus comments on blog posts"
