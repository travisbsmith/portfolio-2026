import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSubstackPosts } from '../utils/substack';
import { htmlToMarkdown } from '../utils/html-to-markdown';

export const GET: APIRoute = async () => {
  // Fetch all content
  const workEntries = await getCollection('work');
  const sortedWork = workEntries.sort((a, b) => a.data.order - b.data.order);
  const posts = await getSubstackPosts();

  const sections: string[] = [];

  // Header
  sections.push(`# Travis Smith - Design Leader - Full Context

> This file contains the complete content from fully-operational.com for use by AI assistants and language models.

Generated: ${new Date().toISOString()}

---
`);

  // About section
  sections.push(`## About Travis Smith

Hey there. I'm Travis. I build teams and solve problems.

I'm currently Head of Design, People Experiences at **Deel**, where I lead an amazing team of creative minds. We're all about helping companies really connect with their people through innovative HR and payroll experiences—figuring out what makes global teams tick and how to support them effectively.

I've spent the last 17+ years diving into user research and product design, working with all sorts of companies—from big names like Heinz, Burger King, and Mack Trucks to tech companies like **Shopify**, **Grubhub**, and **The Tie Bar**. But what really gets me excited? Building great teams. For the past decade, I've been focused on bringing designers, researchers, and content folks together, helping them do their best work through mentoring and creating processes that actually make sense.

### Design Principles

1. **Clarity over complexity** - Complex problems deserve simple solutions. Clear thinking leads to clear design.
2. **Systems thinking** - Good design scales. I build systems that empower teams to move faster.
3. **Ship and iterate** - Perfection is the enemy of progress. Launch, learn, and improve.
4. **Grow the craft** - The best work happens when designers are supported, challenged, and trusted.

### Experience

- **Head of Design, People Experiences — Deel** (2024–Present): Leading the People Experiences team focused on Talent Acquisition, HRIS, Employee Engagement, Deel IT and Growth.
- **Head of Design — Shopify** (Jul 2020–2024): Led the Engage group, a cross-functional team of 25+. Delivered $3.2B+ in GMV. Catapulted 1P app adoption 50%.
- **Head of Design — Grubhub** (Feb 2016–Jun 2020): Led Chicago Design Studio with 45+ designers, researchers, and content strategists. Achieved 95% increase in forecasting accuracy. Increased restaurant onboarding speed 86%.
- **Director of Product Design & Engineering — The Tie Bar** (Mar 2015–Jan 2016): Managed product, design, and engineering for $20M+ e-commerce platform. Increased conversion 0.5% desktop, 10%+ mobile.
- **Director, UX — VSA Partners** (May 2013–Mar 2015): Led strategy and design for Kraft, Kimberly Clark, CME Group, Mack Trucks, and Chicago Dept of Aviation.

---
`);

  // Case Studies section
  sections.push(`## Case Studies
`);

  for (const work of sortedWork) {
    sections.push(`### ${work.data.title} — ${work.data.company}

**Tags:** ${work.data.tags.join(', ')}

${work.data.description}

${work.body || ''}

---
`);
  }

  // Blog posts section
  sections.push(`## Writing
`);

  if (posts.length > 0) {
    for (const post of posts) {
      const dateStr = post.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      const markdownContent = htmlToMarkdown(post.content);
      
      sections.push(`### ${post.title}

**Date:** ${dateStr}
**Author:** ${post.author || 'Travis Smith'}
**Original:** ${post.link}

${markdownContent}

---
`);
    }
  } else {
    sections.push(`*Blog posts coming soon. Subscribe at https://substack.com/@travisbsmith*

---
`);
  }

  // Shopify Consulting section
  sections.push(`## Shopify Expert — Store Setup & Consulting

Travis Smith is a Shopify expert who helped design the tools merchants use every day: Shopify Email, Shopify Inbox, Shopify Forms, and the Customer, Marketing, and Analytics sections of Shopify Admin.

**Background:** Head of Design at Shopify (Jul 2020–2024). Led the Engage group, team of 25+. Delivered $3.2B+ in GMV. Catapulted 1P app adoption 50%.

### Who Travis Helps

- **New to Shopify** — Store setup, first sales, avoiding overwhelm. No tech background required.
- **Existing stores** — Better use of Shopify Email, customer segmentation, marketing tools.

### Services

- **Store setup** — Products, payments, shipping, and the basics that matter
- **Marketing & customer data** — Shopify Email, Inbox, Forms, segmentation
- **Strategic guidance** — Plain-language advice without tech jargon

**Signup:** https://fully-operational.com/shopify
**Markdown:** https://fully-operational.com/shopify.md

---
`);

  // Contact section
  sections.push(`## Work With Travis

Travis Smith is a design leader with 17+ years of experience building products and teams at companies like Shopify, Grubhub, and Deel. He is available for **consulting engagements** and **fractional design leadership** roles.

### How Travis Can Help

- **Shopify Consulting** — Store setup, marketing tools, customer data (see /shopify)
- **Scaling Design Teams** — Hiring, onboarding, and building high-performing design organizations
- **Design Systems** — Establishing systems that empower teams to move faster with consistency
- **Strategic Product Design** — Providing direction on complex product challenges and user experience strategy
- **Design Operations** — Implementing processes, critiques, and workflows that elevate design quality
- **Executive Coaching** — Mentoring design leaders and helping them grow in their careers

### Get In Touch

- **Email:** hello@fully-operational.com
- **LinkedIn:** https://www.linkedin.com/in/travisbsmithux/
- **Website:** https://fully-operational.com
- **Substack:** https://substack.com/@travisbsmith
`);

  const content = sections.join('\n');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
