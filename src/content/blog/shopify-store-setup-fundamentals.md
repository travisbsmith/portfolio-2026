---
title: "Five Things Every Founder Gets Wrong When Setting Up a Shopify Store"
description: "Products, variants, collections, pages, templates, inventory, metafields — the structural decisions that affect everything downstream, and how to get them right."
date: 2026-05-18
tags: ["Shopify", "Store Setup", "E-commerce Strategy"]
draft: false
---

Most Shopify stores are built the same way: a founder signs up, starts clicking around, adds some products, and figures the rest out as they go. That works up to a point. The problem is that some early setup decisions are structural — they affect everything downstream — and fixing them after you're live is painful.

I've been inside enough stores in the past year to see the same five mistakes come up over and over. Here's what they are and how to get them right the first time.

## 1. Treating every SKU as a separate product

A founder I worked with recently — a premium tote brand — had created separate product listings for what should have been one product with two variants: a smaller bag and a full-size bag. Her collections showed both as individual items, her analytics were split, and customers couldn't compare them side by side on a single page.

The rule is simple: if two items share the same product story but differ only in a configurable attribute — size, color, scent, material — they belong as variants under one product, not as separate products.

Where this breaks down most often is with color. Founders create one product per colorway because that's how they think about inventory. But from Shopify's perspective (and from the customer's perspective), "Tote in Black" and "Tote in Natural" are the same product with two variants. Keeping them as separate products fragments your analytics, bloats your collections, and makes the store harder to navigate.

The exception: genuinely different things. A conditioner and a shampoo are two products even if they're sold together. A conditioner in two scents is one product with two variants.

## 2. Creating collections that mirror your inventory system

Collections are for shoppers, not for warehouses.

I saw a store recently where the navigation had collections organized by the founder's internal categories — basically their supplier breakdown. Made total sense to the founder. Made no sense to a first-time visitor trying to find something to buy.

Organize your collections the way a customer shops: "Best Sellers," "Bundles," "New Arrivals," "Under $50," "Gift Sets." These are the names that help someone find what they're looking for in 10 seconds.

The practical issue: most early stores use manual collections, which means you add products by hand. When you add a new product and forget to update three of your collections — which everyone does — those collections go quietly out of date. Switch to automated collections with tag-based rules as soon as you have more than 10–15 products. Your products self-organize from that point forward.

## 3. Not understanding the difference between pages and page templates

This is the one that creates the most unnecessary work. I flagged it in my kickoff notes with one founder after seeing she'd been creating a new one-off page layout every time she needed a page to look different.

Here's the distinction:

- A **page** is a specific piece of content at a fixed URL. Your About page, your FAQ, your Locations page — these are pages.
- A **page template** is the layout that controls how a page looks. Templates are reusable. One template can power 10 pages.

When you want an About page that looks different from your FAQ page, you don't build a custom page from scratch. You create a new template with the sections you want, then assign it to the About page. If you later want to tweak how all pages using that template look, you change the template once — not every page individually.

The failure mode is having 15 pages where each one was independently styled, usually by someone duplicating the previous page and editing it. You end up with 15 slightly different layouts with no consistent way to update them. Define your templates deliberately, assign them intentionally, and use your page content for content — not for design.

## 4. Setting up inventory wrong (or not at all)

Three things to configure before you take a single order:

**Track quantity** — go to every product and make sure inventory tracking is enabled. If it's off, Shopify doesn't decrement your stock count when someone buys. You'll oversell and not know it.

**"Continue selling when out of stock"** — turn this off for physical products. If you run out, you don't want to keep taking orders you can't fill. Turn it on only if you're running a deliberate pre-order strategy.

**Starting quantities** — if you migrated from a spreadsheet or another platform, verify that your inventory numbers are accurate. A starting count of zero means Shopify marks everything out of stock, and customers see the "sold out" badge.

One more: start with a single fulfillment location. Multi-location inventory is powerful once you have a second warehouse, a retail store, or a 3PL — but it adds meaningful complexity before that point. One location, clean setup, then add complexity only when you have a real operational reason for it.

## 5. Adding products before defining your metafields

Metafields are custom data fields you add to products, collections, or pages — ingredient lists, care instructions, material specs, certifications, size guides. Anything Shopify's standard product fields don't cover.

The reason to define them before you add products: if you add 40 products and then realize you need a "materials" field, you now need to go back and fill it in on all 40. If you define the field first, it's waiting for you every time you add a new product going forward.

This matters more than it seems for one reason: your metafield data lives inside Shopify's native structure, not inside a third-party app. That means it doesn't disappear when you uninstall an app. It's portable across themes. You can reference it in your emails, your automations, and your storefront without being dependent on a vendor.

Go to Settings → Custom Data → Products before you start building out your catalog. Define the fields your store needs — even just 3 or 4 — and you'll thank yourself six months later.

---

The deeper pattern in all five of these: Shopify has a specific model for how stores are meant to be structured, and working with it is dramatically easier than working around it. The founders who end up needing the most help are almost always the ones who built their store around how they were already thinking — instead of taking two hours to understand how Shopify thinks first.

---

*Travis Smith is a former Head of Design at Shopify (2020–2025) and works with a small number of early-stage DTC founders on Shopify store strategy. [Book a free 30-min call.](/book)*
