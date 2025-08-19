// 2025 Best Practice: ATS + Recruiter Optimized, white background, subtle accents only.
import React from 'react';
export function ProfessionalSimpleTemplate({ data }: { data: any }) {
  // Defensive check for skills to prevent [object Object] rendering
  const renderSkills = (skills: any) => {
    if (!skills) return '';
    if (Array.isArray(skills)) {
      return skills.map((skill: any) => {
        if (typeof skill === 'string') return skill;
        if (skill && typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
      }).join(', ');
    }
    if (typeof skills === 'string') return skills;
    return String(skills);
  };

  return (
    <div className="bg-white p-6 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-4">
      {/* Personal Info Block - Complete with all contact details */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold mb-1">{data.personalInfo?.fullName || ''}</div>
        <div className="text-sm text-gray-700 space-y-1">
          {data.personalInfo?.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo?.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo?.location && <div>{data.personalInfo.location}</div>}
          {(data.personalInfo?.linkedin || data.personalInfo?.website) && (
            <div className="flex justify-center gap-4 text-blue-600">
              {data.personalInfo?.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  {data.personalInfo.linkedin}
                </a>
              )}
              {data.personalInfo?.website && (
                <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer">
                  {data.personalInfo.website}
                </a>
              )}
            </div>
          )}
        </div>
        {data.personalInfo?.summary && (
          <div className="mt-3 italic text-gray-700">{data.personalInfo.summary}</div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-emerald-700">Experience</div>
        <ul className="list-disc pl-5 space-y-2">
          {data.experiences?.map((exp: any) => (
            <li key={exp.id}>
              <div><span className="font-semibold">{exp.position}</span> at {exp.company} <span className="text-xs text-gray-500">({exp.startDate} – {exp.endDate})</span></div>
              <div className="text-xs text-gray-700 ml-2">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-emerald-700">Education</div>
        <ul className="list-disc pl-5 space-y-2">
          {data.education?.map((edu: any) => (
            <li key={edu.id}>
              {edu.degree} in {edu.field} at {edu.institution} <span className="text-xs text-gray-500">({edu.startDate} – {edu.endDate})</span>
              {edu.gpa && <span className="ml-2 text-xs">GPA: {edu.gpa}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-emerald-700">Skills</div>
        <div>{renderSkills(data.skills)}</div>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-emerald-700">Certifications</div>
        <ul className="list-disc pl-5 space-y-1">
          {data.certifications?.map((cert: any) => (
            <li key={cert.id}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
      </div>
      {data.languages?.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="font-bold text-emerald-700">Languages</div>
          <ul className="list-disc pl-5 space-y-1">
            {data.languages.map((lang: any, idx: number) => (
              <li key={idx}>{lang.name} – {lang.proficiency}</li>
            ))}
          </ul>
        </div>
      )}
      {data.references?.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="font-bold text-emerald-700">References</div>
          <ul className="list-disc pl-5 space-y-1">
            {data.references.map((ref: any, idx: number) => (
              <li key={idx}>
                <strong>{ref.name}</strong>, {ref.title} at {ref.company}<br />
                {ref.email} | {ref.phone}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 