# Deployment Guide

This guide walks you through deploying your portfolio to GitHub Pages and connecting your Namecheap domain.

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `portfolio` or `fully-operational`)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (you already have one)
5. Click "Create repository"

## Step 2: Push Your Code

Open terminal in your project folder and run:

```bash
cd "/Users/travissmith/Portfolio Site 2026"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial portfolio site"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. The site will automatically build and deploy

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Step 4: Configure Custom Domain (Namecheap)

### In GitHub:

1. Go to repo **Settings** > **Pages**
2. Under "Custom domain", enter: `fully-operational.com`
3. Click **Save**
4. Wait for DNS check (may show error until DNS is updated)

### In Namecheap:

1. Log in to [namecheap.com](https://namecheap.com)
2. Go to **Domain List** > find `fully-operational.com` > **Manage**
3. Click **Advanced DNS** tab
4. **Delete** any existing records pointing to Squarespace:
   - Delete any A Records pointing to Squarespace IPs
   - Delete any CNAME records for www pointing to Squarespace

5. **Add** the following records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |
| CNAME | www | YOUR_USERNAME.github.io. | Automatic |

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 5: Wait for DNS Propagation

- DNS changes can take 5-30 minutes (sometimes up to 48 hours)
- You can check progress at [dnschecker.org](https://dnschecker.org)
- Enter `fully-operational.com` and check if A records show GitHub's IPs

## Step 6: Enable HTTPS

1. After DNS propagates, go back to GitHub **Settings** > **Pages**
2. You should see a green checkmark next to your custom domain
3. Check the box: **Enforce HTTPS**
4. Wait a few minutes for the SSL certificate to be issued

## Verification

Your site should now be live at:
- https://fully-operational.com
- https://www.fully-operational.com (redirects to above)

## Troubleshooting

### "Domain not properly configured"
- Wait longer for DNS propagation
- Double-check the A records and CNAME in Namecheap
- Ensure you deleted old Squarespace records

### 404 Error
- Make sure the `CNAME` file exists in your `public/` folder
- Verify the build completed successfully in GitHub Actions

### HTTPS not available
- Wait for DNS to fully propagate
- The SSL certificate can take up to 15 minutes after DNS resolves

## Making Updates

After initial setup, any push to `main` will automatically rebuild and deploy:

```bash
git add .
git commit -m "Updated blog post"
git push
```

The site will update in about 1-2 minutes.
