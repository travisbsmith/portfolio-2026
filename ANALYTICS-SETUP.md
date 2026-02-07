# Analytics Dashboard Setup

This guide walks you through setting up the analytics dashboard for your portfolio site.

## Overview

The dashboard uses:
- **Umami** - Privacy-friendly, open-source analytics
- **GitHub Actions** - Weekly email summaries
- **Resend** - Email delivery (optional)

## Step 1: Set Up Umami Cloud (Free Tier)

1. Go to [cloud.umami.is](https://cloud.umami.is) and create an account
2. Click "Add website" and enter:
   - **Name**: Portfolio Site
   - **Domain**: fully-operational.com
3. Copy your **Website ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
4. Go to Settings → API Keys and create a new API key
5. Copy the **API Token**

## Step 2: Add Secrets to GitHub

Go to your repo → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `PUBLIC_UMAMI_WEBSITE_ID` | Your Website ID from Step 1 |
| `PUBLIC_UMAMI_URL` | `https://cloud.umami.is` |
| `UMAMI_API_TOKEN` | Your API Token from Step 1 |
| `RESEND_API_KEY` | (Optional) For weekly emails - get from [resend.com](https://resend.com) |
| `DASHBOARD_PASSWORD` | Password for dashboard access (default: `travis2026`) |

## Step 3: Update Dashboard Password

Edit `src/pages/dashboard.astro` and change the password:

```javascript
const DASHBOARD_PASSWORD = 'your-secure-password-here';
```

## Step 4: Deploy

Push your changes. The tracking script will automatically start collecting data.

```bash
git add .
git commit -m "Configure analytics"
git push
```

## Step 5: Access Your Dashboard

Visit `https://fully-operational.com/dashboard` and enter your password.

---

## Features

### Real-Time Metrics
- Page views and unique visitors
- Bounce rate and session duration
- Top pages and referrers
- Country and device breakdown

### LLM Traffic Tracking
The dashboard tracks AI/LLM traffic to:
- `/llms.txt` - Site overview for AI
- `/llms-full.txt` - Full content dump
- `/blog/*.md` - Markdown blog posts
- `/work/*.md` - Case study markdown

### Weekly Summary Emails
Every Monday at 9 AM, you'll receive:
- Week-over-week comparison
- Top 5 pages
- New referral sources
- LLM traffic stats

---

## Troubleshooting

### Dashboard shows "Demo Data"
- Ensure `PUBLIC_UMAMI_WEBSITE_ID` is set in GitHub Secrets
- Ensure `UMAMI_API_TOKEN` is set for API access
- Redeploy the site after adding secrets

### No data appearing
- It takes a few minutes for first data to appear
- Check that the tracking script is loading (View Source → search for "umami")
- Ensure your domain matches what's configured in Umami

### Weekly emails not sending
- Ensure `RESEND_API_KEY` is set in GitHub Secrets
- Check GitHub Actions logs for errors

---

## Privacy

Umami is privacy-friendly:
- No cookies used
- No personal data collected
- GDPR compliant
- Data stored in EU/US (your choice)

The tracking script respects Do Not Track browser settings.
