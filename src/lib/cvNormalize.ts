export type CVData = {
  templateId?: string;
  personalInfo?: any;
  experiences?: any[];
  education?: any[];
  skills?: any[];
  certifications?: any[];
  projects?: any[];
  languages?: any[];
  references?: any[];
};

function tryParse(v: any) {
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
}

/** Accept ANY server shape and return the flat builder JSON */
export function unwrapBuilder(payload: any): any {
  if (!payload) return null;

  // common server wrappers
  let b =
    payload?.parsed_data ??
    payload?.data ??
    payload?.builder ??
    payload?.content ??
    payload;

  b = tryParse(b);

  // peel nested layers up to 3 times
  for (let i = 0; i < 3 && b; i++) {
    if (typeof b === "string") b = tryParse(b);
    if (!b) break;

    // if we see { data: {...} } where inner has builder fields
    if (b?.data && (b.data.personalInfo || b.data.builder || b.data.experiences)) {
      b = b.data;
      continue;
    }
    // if we see { builder: {...} }
    if (b?.builder && !b.personalInfo) {
      b = b.builder;
      continue;
    }
    break;
  }

  return b;
}

/** Normalize to the shape templates expect */
export function normalizeBuilder(raw: any): CVData {
  const b = unwrapBuilder(raw) || {};
  const pi = b.personalInfo || {};

  return {
    templateId: b.templateId ?? raw?.template_id ?? "minimal-clean",
    personalInfo: {
      fullName: pi.fullName ?? b?.name ?? "",
      email: pi.email ?? "",
      phone: pi.phone ?? "",
      location: pi.location ?? "",
      linkedin: pi.linkedin ?? pi.linkedIn ?? "",
      website: pi.website ?? "",
      summary: pi.summary ?? "",
    },
    experiences: Array.isArray(b.experiences) ? b.experiences : [],
    education: Array.isArray(b.education) ? b.education : [],
    skills: Array.isArray(b.skills) ? b.skills : [],
    certifications: Array.isArray(b.certifications) ? b.certifications : [],
    projects: Array.isArray(b.projects) ? b.projects : [],
    languages: Array.isArray(b.languages) ? b.languages : [],
    references: Array.isArray(b.references) ? b.references : [],
  };
}
