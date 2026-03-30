import { kv } from '@vercel/kv';

export type LeadStage = 'Lead' | 'Call Scheduled' | 'Proposal Sent' | 'Active' | 'Closed';

export interface Lead {
  id: string;
  // From booking form
  name: string;
  email: string;
  storeUrl: string;
  storeStatus: string;
  challenge: string;
  serviceInterest: string;
  availability?: string;
  timezone?: string;
  referral?: string;
  additionalNotes?: string;
  // Managed in dashboard
  stage: LeadStage;
  internalNotes: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

const KV_KEY = 'leads';

export async function getLeads(): Promise<Lead[]> {
  try {
    return (await kv.get<Lead[]>(KV_KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function saveLead(lead: Lead): Promise<void> {
  const leads = await getLeads();
  const idx = leads.findIndex((l) => l.id === lead.id);
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], ...lead, updatedAt: new Date().toISOString() };
  } else {
    leads.unshift(lead); // newest first
  }
  await kv.set(KV_KEY, leads);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const leads = await getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  leads[idx] = { ...leads[idx], ...patch, updatedAt: new Date().toISOString() };
  await kv.set(KV_KEY, leads);
  return leads[idx];
}
