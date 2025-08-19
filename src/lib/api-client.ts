import { supabase } from "./supabase";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function authHeaders() {
  // Get the current session each time to avoid stale tokens
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req(path: string, init: RequestInit = {}, auth: boolean = true) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (auth) Object.assign(headers, await authHeaders());

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      `${init.method || "GET"} ${path} failed: ${res.status} ${text || ""}`
    );
  }
  return body;
}

export const getJson = (path: string, auth = true) =>
  req(path, { method: "GET" }, auth);

export const postJson = (path: string, body: unknown, auth = true) =>
  req(path, { method: "POST", body: JSON.stringify(body) }, auth);

export const putJson = (path: string, body: unknown, auth = true) =>
  req(path, { method: "PUT", body: JSON.stringify(body) }, auth);

export const delJson = (path: string, auth = true) =>
  req(path, { method: "DELETE" }, auth);

/** Facades expected elsewhere in the app */

// Subscription widget endpoints
export const subscriptionApi = {
  getStatus: () => getJson('/api/subscription/status'),
  getPricing: () => getJson('/api/subscription/pricing'),
  purchaseExtras: (payload: { pack_type: string; quantity: number; price: number; currency?: string }) =>
    postJson('/api/subscription/purchase-extras', payload),
};

// Apply flow endpoints
export const applyApi = {
  applySingle: (payload: any) => postJson('/api/apply', payload),
  applyBatch:  (payload: any) => postJson('/api/apply/batch', payload),
};

// CV endpoints used by builder
export const cvApi = {
  create: (payload: any) => postJson('/api/cv/create', payload),
  update: (id: string, payload: any) => putJson(`/api/cv/${id}`, payload),
};

/** 🔁 Back-compat aliases so legacy imports don't break */

// Some files import PascalCase names:
export const SubscriptionApi = subscriptionApi;
export const ApplyApi        = applyApi;

// Some older files (e.g., ApplyButton.tsx) import `JobsHubApi`;
// Map it to apply endpoints so they keep working without refactor:
export const JobsHubApi = {
  apply:      (payload: any) => postJson('/api/apply', payload),
  applyBatch: (payload: any) => postJson('/api/apply/batch', payload),
};

// Keep default export as a shim with post/put/get to avoid
// "ApiClient.post is not a function" in untouched codepaths.
const ApiClient = { post: postJson, put: putJson, get: getJson };
export default ApiClient;