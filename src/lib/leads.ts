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
  completedChecks?: string[];
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
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
    const hash = await kv.hgetall<Record<string, string>>(KV_KEY);
    if (!hash) return [];
    return Object.values(hash).map((v) => (typeof v === 'string' ? JSON.parse(v) : v) as Lead);
  } catch {
    return [];
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  try {
    const kv = await getKV();
    const raw = await kv.hget<string>(KV_KEY, id);
    if (!raw) return null;
    return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Lead;
  } catch {
    return null;
  }
}

export async function saveLead(lead: Lead): Promise<void> {
  const kv = await getKV();
  await kv.hset(KV_KEY, { [lead.id]: JSON.stringify(lead) });
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const kv = await getKV();
  const existing = await getLead(id);
  if (!existing) return null;
  const updated: Lead = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  await kv.hset(KV_KEY, { [id]: JSON.stringify(updated) });
  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  const kv = await getKV();
  const existing = await getLead(id);
  if (!existing) return false;
  await kv.hdel(KV_KEY, id);
  return true;
}
