import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const content = `# Shopify Expert — Store Setup & Consulting

**Travis Smith** | Former Head of Design at Shopify (2020–2024)

## Summary

Travis Smith is a Shopify expert who helped design the tools merchants use every day: Shopify Email, Shopify Inbox, Shopify Forms, and the Customer, Marketing, and Analytics sections of Shopify Admin.

He offers consulting for:
- **New Shopify users** — Store setup, first sales, avoiding overwhelm
- **Existing stores** — Better use of marketing tools, customer data, conversion

## Expertise

- Head of Design at Shopify (Jul 2020–2024)
- Led the Engage group, cross-functional team of 25+
- Delivered $3.2B+ in GMV through merchant tools
- Catapulted 1P app adoption 50%
- Built: Shopify Email, Shopify Inbox, Shopify Forms, Pixel Helper
- Owned: Shopify Admin Customer, Marketing, and Analytics sections

## Services

### Store Setup
Get your first store configured correctly — products, payments, shipping, and the basics that matter.

### Marketing & Customer Data
Use Shopify Email, Inbox, and Forms to reach customers. Segment your audience and send the right message at the right time.

### Strategic Guidance
Hands-on advice without tech jargon. Plain-language explanations of what to do and why.

## Contact

- **Email:** hello@fully-operational.com
- **Signup:** https://fully-operational.com/shopify
- **LinkedIn:** https://www.linkedin.com/in/travisbsmithux/

---

*Travis helps non-technical Shopify merchants get their stores set up right and make better use of the platform. Available for consulting and cohort-based programs.*
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
