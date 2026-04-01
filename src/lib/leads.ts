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

function kvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV env vars not set');
  return { url, token };
}

// Use the Upstash REST API directly — avoids any @vercel/kv abstraction issues.
async function kvFetch(command: string[]): Promise<any> {
  const { url, token } = kvConfig();
  const res = await fetch(`${url}/${command.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`KV error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.result;
}

function parseLead(raw: unknown): Lead {
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Lead;
}

export async function getLeads(): Promise<Lead[]> {
  try {
    // HGETALL returns [field, value, field, value, ...] as a flat array
    const result: string[] | null = await kvFetch(['hgetall', KV_KEY]);
    if (!result || result.length === 0) return [];
    const leads: Lead[] = [];
    for (let i = 0; i < result.length; i += 2) {
      leads.push(parseLead(result[i + 1]));
    }
    return leads;
  } catch (e) {
    console.error('getLeads error:', e);
    return [];
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  try {
    const raw = await kvFetch(['hget', KV_KEY, id]);
    if (!raw) return null;
    return parseLead(raw);
  } catch (e) {
    console.error('getLead error:', e);
    return null;
  }
}

export async function saveLead(lead: Lead): Promise<void> {
  await kvFetch(['hset', KV_KEY, lead.id, JSON.stringify(lead)]);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const existing = await getLead(id);
  if (!existing) return null;
  const updated: Lead = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  await kvFetch(['hset', KV_KEY, id, JSON.stringify(updated)]);
  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  const existing = await getLead(id);
  if (!existing) return false;
  await kvFetch(['hdel', KV_KEY, id]);
  return true;
}
