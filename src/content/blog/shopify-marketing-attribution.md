---
title: "Marketing Attribution on Shopify: What It Is, What It Isn't, and What to Actually Watch"
description: "Most founders are either ignoring their attribution data or trusting it too much. Here's how to read it correctly — illustrated with the tracking problems I see most often."
date: 2026-05-18
tags: ["Shopify", "Analytics", "Marketing"]
draft: false
---

I've worked with founders who check their Shopify analytics every day and still can't tell me where their sales are coming from. I've also worked with founders who never look at it at all. Both are making decisions with less information than they think they have.

Marketing attribution should answer one question: where did this customer come from? Getting that answer right changes how you allocate your budget and what you double down on. But there are a few ways the data will mislead you if you don't know what you're looking at.

## What attribution is — and one way it lies

Shopify attributes each sale to the channel that drove the session in which the purchase happened. This is called last-click attribution, and it has a specific blind spot: it only sees the last thing that happened before the purchase, not everything that led up to it.

A customer sees your product on TikTok twice, then finds you in an Instagram Story, then Googles your brand name and buys. Attribution logs the sale as organic search. TikTok gets nothing.

This doesn't mean organic search is overperforming — it means you have a high-intent channel (branded search) that's closing sales that other channels started. You can't see that full picture in last-click, so you have to be careful about pulling budget from channels that aren't closing because they often aren't supposed to.

## The four main sources — and what they actually mean

**Organic search** is your clearest signal. Someone searched for something, found you, and clicked. Track this monthly. Consistent growth means your SEO is working.

**Paid search / paid social** should have UTM parameters from your campaigns. If you're running Meta ads and don't see them as a source in your attribution report, the campaign UTMs weren't set up correctly — and every sale from those ads is landing in direct.

**Referral** covers other sites linking to you: press mentions, partner sites, social platforms, and increasingly, AI search engines. I've seen ChatGPT referral traffic appear in real stores already — check for `openai.com`, `perplexity.ai`, `claude.ai`, and `bing.com` in your referral list.

**Direct is the one most founders misread.** Direct traffic is sessions where Shopify can't identify a source. The instinct is to read this as loyal customers who go straight to your URL. In almost every store I've audited, that's not what's happening.

One founder I worked with had a significant portion of her traffic showing as direct when she was running active TikTok campaigns. The actual problem: her Linktree integration with Shopify wasn't passing the referral data correctly. Every click from her TikTok bio was landing in direct. Her TikTok channel looked like it was contributing nothing, and her direct traffic looked artificially inflated — all because of one broken integration.

If your direct traffic is high — over 30–40% of sessions — treat it as a tracking problem to investigate, not as a performance signal to celebrate.

## Email: the channel that disappears without UTMs

This is the most common attribution gap I fix.

A founder had a Klaviyo account showing conversions on her flows — abandoned cart, welcome series, post-purchase. But when she looked at Shopify's channel breakdown, email didn't show up at all. She was considering cutting back on email to focus on ads.

The problem: her email links didn't have UTM parameters. Every click from her email was landing in direct. Klaviyo was recording its own conversion data internally, but Shopify had no idea the traffic came from email.

The fix is a one-time setting: in Klaviyo, go to Account → Settings → UTM Tracking and turn on automatic UTM parameters. Every email link gets tagged going forward. Once she turned this on, email jumped to her top-converting channel in Shopify's attribution — which it had been the whole time.

If you're using Shopify Email instead of Klaviyo, check that the campaigns and flows include UTM-tagged links. Shopify Email does this automatically for some sends, but verify it's working on your flows.

## The list inflation problem

One founder I worked with had over 1,100 contacts in Klaviyo. Her open rates were around 8% and she assumed email just wasn't working for her business.

When we dug in: she had 36 real, engaged subscribers. The rest were a mix of bot signups (geographic patterns from places like Nairobi that didn't match her customer base at all), ghost contacts from a previous platform migration, and profiles that had immediately withdrawn consent after signing up.

Klaviyo charges by active profile count. She was paying for 1,100 contacts and reaching 36. Her deliverability was being dragged down by sending to a dirty list. And her 8% open rate was actually much higher among real subscribers — it just looked low because of all the dead weight.

The fix: filter for contacts with no email opens in the last 90 days, run a re-engagement campaign, delete everyone who doesn't respond. Do this quarterly. A clean list of 100 engaged contacts will outperform a dirty list of 1,000 on every metric.

## What to actually look at, and how often

**Weekly (5 minutes):** Sessions total, conversion rate, top traffic sources. You're looking for meaningful changes from the prior week — anything that moved significantly and might need an explanation.

**Monthly (20 minutes):** Channel breakdown by sales (not just sessions — conversion rate varies dramatically by source), top landing pages, and the AI referral check. Also look at your email channel specifically: if it's not showing up or underperforming relative to what Klaviyo reports, there's a UTM gap to fix.

**When something specific happens:** A spike in direct after a new campaign almost always means UTM parameters weren't configured. A conversion rate drop with stable traffic usually means something changed on the site — a new app was installed, a product page was edited, or a checkout step broke. A paid channel with traffic but no conversions usually means the ad and the landing page aren't aligned.

## The number most founders check too much

Conversion rate for stores under $5k/month is almost statistically meaningless on a daily or even weekly basis. With low traffic volume, a single day of three purchases versus one purchase will swing your "conversion rate" by several percentage points. Founders obsess over these fluctuations and make design decisions based on noise.

Check conversion rate monthly. Look for trends over 4–6 week periods. Day-to-day variation in a low-traffic store is just variance, not signal.

---

*Travis Smith is a former Head of Design at Shopify (2020–2025) and works with a small number of early-stage DTC founders on Shopify store strategy. [Book a free 30-min call.](/book)*
