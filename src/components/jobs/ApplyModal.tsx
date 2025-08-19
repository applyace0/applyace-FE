import { useEffect, useState, useMemo } from "react";
import { useApply } from "@/hooks/useApply";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { JobsHubApi } from "@/lib/api-client";
import { getJson, postJson } from "@/lib/api-client";

type JobItem = { id: string; title?: string; company?: string; jd_content: string };
type CV = { id: string; name: string; content?: any };

export default function ApplyModal({
  open,
  onClose,
  auth,
  jobs,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  auth: { token: string; userId: string; devUserId?: string; affiliateId?: string };
  jobs: JobItem[];
  onSubmitted?: () => void;
}) {
  const { applySingle, applyBatch, cooldownMs } = useApply(auth);
  const { toast } = useToast();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [cvId, setCvId] = useState("");
  const [showCreateCV, setShowCreateCV] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [busy, setBusy] = useState(false);
  const multi = jobs.length > 1;
  const [bearerToken, setBearerToken] = useState<string>("");
  
  // Tailor Preview state
  const [preview, setPreview] = useState<null | {
    match: number;
    keywords: string[];
    summary: string[];
    suggested_name: string;
  }>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.auth.getSession().then(({ data }) => {
      const t = data?.session?.access_token || auth.token || "";
      setBearerToken(t);
      try {
        const json = await getJson('/api/cv/list');
        const list = (json?.data || []).map((r: any) => ({ id: r.id, name: r.title || 'Untitled CV' })) as CV[];
        setCvs(list);
        setCvId(list[0]?.id || '');
      } catch (error) {
        console.debug("CV list unavailable (dev):", error);
        // Fallback to demo data
        const local = JSON.parse(localStorage.getItem('demo_cvs') || '[]') as CV[];
        if (!local.length) {
          const seed = [
            { id: 'cv_demo_1', name: 'Professional CV' },
            { id: 'cv_demo_2', name: 'Tech CV' },
          ];
          localStorage.setItem('demo_cvs', JSON.stringify(seed));
          setCvs(seed);
          setCvId(seed[0].id);
        } else {
          setCvs(local);
          setCvId(local[0]?.id || '');
        }
      }
    .catch(() => {
      const local = JSON.parse(localStorage.getItem('demo_cvs') || '[]') as CV[];
      if (!local.length) {
        const seed = [
          { id: 'cv_demo_1', name: 'Professional CV' },
          { id: 'cv_demo_2', name: 'Tech CV' },
        ];
        localStorage.setItem('demo_cvs', JSON.stringify(seed));
        setCvs(seed);
        setCvId(seed[0].id);
      } else {
        setCvs(local);
        setCvId(local[0]?.id || '');
      }
    });
  }, [open, auth.token, auth.userId]);

  const header = useMemo(() => {
    if (!multi) return `Apply to ${jobs[0]?.title || "Job"}`;
    return `Apply to ${jobs.length} Jobs`;
  }, [multi, jobs]);

  async function submit() {
    if (!cvId || busy || cooldownMs > 0) return;
    setBusy(true);
    try {
      if (!multi) {
        await applySingle({
          user_id: auth.userId,
          cv_id: cvId,
          job_id: jobs[0].id,
          jd_content: jobs[0].jd_content,
          affiliate_id: auth.affiliateId,
        });
      } else {
        await applyBatch({
          user_id: auth.userId,
          cv_id: cvId,
          jobs: jobs.map(j => ({ job_id: j.id, jd_content: j.jd_content })),
          affiliate_id: auth.affiliateId,
        });
      }
      onSubmitted?.();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function handleTailorPreview() {
    if (!cvId) {
      toast({
        title: "CV Required",
        description: "Please select a CV first",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoadingPreview(true);
      setPreview(null);
      
      const response = await JobsHubApi.tailorPreview({
        user_id: auth.userId,
        cv_id: cvId,
        jd_content: jobs[0].jd_content,
      });

      if (response.status === 'success' && response.data) {
        setPreview(response.data);
      } else {
        toast({
          title: "Preview Failed",
          description: response.message || "Failed to generate preview",
          variant: "destructive"
        });
      }
    } catch (e) {
      console.error('Preview error:', e);
      toast({
        title: "Preview Error",
        description: "Failed to generate preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{header}</h3>
            <p className="text-sm opacity-70">
              Select your CV, optionally generate a cover letter, and submit.
            </p>
          </div>
          <button className="text-xl" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Select CV</label>
          <div className="flex gap-2 mt-2">
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={cvId}
              onChange={(e) => setCvId(e.target.value)}
            >
              {cvs.map(cv => <option key={cv.id} value={cv.id}>{cv.name}</option>)}
              {!cvs.length && <option value="">No CVs yet</option>}
            </select>
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowCreateCV(true)}>+ New</button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tailor Preview</label>
            <button
              type="button"
              className="px-3 py-1 rounded-xl border text-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={handleTailorPreview}
              disabled={!cvId || loadingPreview}
            >
              {loadingPreview ? 'Tailoring…' : 'Tailor CV to this JD (Preview)'}
            </button>
          </div>
          
          {preview && (
            <div className="mt-3 space-y-2 rounded-lg border p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="font-medium">Match</div>
                <div className="text-lg font-bold text-blue-600">{preview.match}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Keywords</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {preview.keywords.map(k => (
                    <span key={k} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">What changed</div>
                <ul className="list-disc pl-5 text-sm">
                  {preview.summary.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="text-sm">
                Suggested filename: <span className="font-mono bg-white px-2 py-1 rounded border">{preview.suggested_name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cover Letter</label>
            <button
              type="button"
              className="px-3 py-1 rounded-xl border text-sm"
              onClick={() => setCoverLetter("(Generated cover letter goes here soon)")}
            >
              Generate Cover Letter
            </button>
          </div>
          <textarea
            className="w-full h-28 mt-2 border rounded-xl px-3 py-2"
            placeholder="Your cover letter will appear here after generation..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs opacity-70">
            {cooldownMs > 0 ? `Cooldown: ${Math.ceil(cooldownMs / 1000)}s` : "Ready"}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={onClose} disabled={busy}>Cancel</button>
            <button
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50"
              onClick={submit}
              disabled={!cvId || busy || cooldownMs > 0}
            >
              {multi ? "Submit Applications" : "Submit Application"}
            </button>
          </div>
        </div>
      </div>

      {showCreateCV && (
        <CreateCVModal
          onClose={() => setShowCreateCV(false)}
          onCreate={(name) => {
            // Create via API; fallback to local demo list on failure
            try {
              await postJson('/api/cv/create', { 
                title: name || 'Untitled CV', 
                content: { personalInfo: {}, experiences: [], education: [], skills: [] }, 
                template_id: 'basic-modern', 
                is_public: false 
              });
              
              const json = await getJson('/api/cv/list');
              const list = (json?.data || []).map((r: any) => ({ id: r.id, name: r.title || 'Untitled CV' })) as CV[];
              setCvs(list);
              setCvId(list[0]?.id || '');
            } catch (error) {
              console.debug("CV creation/list unavailable (dev):", error);
              // Fallback to local demo data
              const newCv = { id: `cv_${Math.random().toString(36).slice(2)}`, name: name || 'Untitled CV' };
              const next = [newCv, ...cvs];
              setCvs(next);
              setCvId(newCv.id);
              localStorage.setItem('demo_cvs', JSON.stringify(next));
            }
            setShowCreateCV(false);
          }}
        />
      )}
    </div>
  );
}

function CreateCVModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState("My New CV");
  const [saving, setSaving] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h4 className="text-lg font-semibold">Create New CV</h4>
        <input
          className="mt-3 w-full border rounded-xl px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={onClose} disabled={saving}>Cancel</button>
          <button
            className="px-3 py-2 rounded-xl bg-black text-white"
            onClick={() => { setSaving(true); onCreate(name); setSaving(false); }}
            disabled={saving}
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

