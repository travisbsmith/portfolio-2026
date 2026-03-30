import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { clientEmail, clientName, service, amount, description } = await request.json();

    if (!clientEmail || !clientName || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find or create Stripe customer
    const existing = await stripe.customers.list({ email: clientEmail, limit: 1 });
    const customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({ email: clientEmail, name: clientName });

    // Create invoice item
    await stripe.invoiceItems.create({
      customer: customer.id,
      amount: Math.round(amount * 100), // cents
      currency: 'usd',
      description: description || service,
    });

    // Create and finalize invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 7,
      metadata: { service },
    });

    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(finalized.id);

    return new Response(JSON.stringify({
      invoiceId: finalized.id,
      hostedUrl: finalized.hosted_invoice_url,
      status: finalized.status,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Invoice creation error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
