import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const content = `# Travis Smith - Design Leader

> Design leadership, product strategy, and building great teams.

## About

Hey there. I'm Travis. I build teams and solve problems.

I'm currently Head of Design, People Experiences at **Deel**, where I lead an amazing team of creative minds. We're all about helping companies really connect with their people through innovative HR and payroll experiences—figuring out what makes global teams tick and how to support them effectively.

I've spent the last 17+ years diving into user research and product design, working with all sorts of companies—from big names like Heinz, Burger King, and Mack Trucks to tech companies like **Shopify**, **Grubhub**, and **The Tie Bar**. But what really gets me excited? Building great teams. For the past decade, I've been focused on bringing designers, researchers, and content folks together, helping them do their best work through mentoring and creating processes that actually make sense.

I love collaborating with product and engineering leaders to drive real results that boost market share year after year. There's something incredibly satisfying about seeing a team come together to create something truly impactful!

## Principles

### 01. Clarity over complexity
Complex problems deserve simple solutions. Clear thinking leads to clear design.

### 02. Systems thinking
Good design scales. I build systems that empower teams to move faster.

### 03. Ship and iterate
Perfection is the enemy of progress. Launch, learn, and improve.

### 04. Grow the craft
The best work happens when designers are supported, challenged, and trusted.

## Experience

### Head of Design, People Experiences — Deel (2024–Present)
Leading the People Experiences team focused on Talent Acquisition, HRIS, Employee Engagement, Deel IT and Growth.

### Head of Design — Shopify (Jul 2020–2024)
Led the Engage group, a cross-functional team of 25+. Delivered $3.2B+ in GMV. Catapulted 1P app adoption 50%.

### Head of Design — Grubhub (Feb 2016–Jun 2020)
Led Chicago Design Studio with 45+ designers, researchers, and content strategists. Achieved 95% increase in forecasting accuracy. Increased restaurant onboarding speed 86%.

### Director of Product Design & Engineering — The Tie Bar (Mar 2015–Jan 2016)
Managed product, design, and engineering for $20M+ e-commerce platform. Increased conversion 0.5% desktop, 10%+ mobile.

### Director, UX — VSA Partners (May 2013–Mar 2015)
Led strategy and design for Kraft, Kimberly Clark, CME Group, Mack Trucks, and Chicago Dept of Aviation.

### Senior UX Strategist — Cramer Krasselt (Jul 2012–May 2013)
Led cross-functional teams for Panera, Heinz, Johnsonville. Won Webby award for Panera website.

---

## Contact

- **Email:** hello@fully-operational.com
- **LinkedIn:** https://www.linkedin.com/in/travisbsmithux/
- **Website:** https://fully-operational.com
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
