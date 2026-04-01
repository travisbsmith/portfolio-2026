export type LeadStage = 'Lead' | 'Call Scheduled' | 'Proposal Sent' | 'Active' | 'Closed' | 'Archived';

export interface Lead {
  id: string;
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
  launchDate?: string;
  hasVisualDesigner?: string;
  nextMeeting?: string;
  nextMeetingISO?: string;
  calBookingUid?: string;
  stage: LeadStage;
  internalNotes: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

const KV_KEY = 'leads';

async function getKV() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV env vars not set');
  const { createClient } = await import('@vercel/kv');
  return createClient({ url, token });
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const kv = await getKV();
    return (await kv.get<Lead[]>(KV_KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function saveLead(lead: Lead): Promise<void> {
  const kv = await getKV();
  const leads = await getLeads();
  const idx = leads.findIndex((l) => l.id === lead.id);
  if (idx >= 0) {
    leads[idx] = { ...leads[idx], ...lead, updatedAt: new Date().toISOString() };
  } else {
    leads.unshift(lead);
  }
  await kv.set(KV_KEY, leads);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const kv = await getKV();
  const leads = await getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  leads[idx] = { ...leads[idx], ...patch, updatedAt: new Date().toISOString() };
  await kv.set(KV_KEY, leads);
  return leads[idx];
}

export async function deleteLead(id: string): Promise<boolean> {
  const kv = await getKV();
  const leads = await getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  await kv.set(KV_KEY, filtered);
  return true;
}
