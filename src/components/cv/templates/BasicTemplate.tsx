// Modern, left-aligned, font-sans, blue headings.
import React from 'react';
export function BasicTemplate({ data }: { data: any }) {
  // Ensure arrays are properly handled with correct field names
  const experiences = Array.isArray(data.experiences) ? data.experiences : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const references = Array.isArray(data.references) ? data.references : [];

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
    <div className="bg-white p-6 rounded shadow text-gray-900 max-w-2xl mx-auto space-y-4 font-sans text-[15px] text-left">
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
        <div className="font-bold text-blue-700">Experience</div>
        <ul className="list-disc pl-5 space-y-2">
          {experiences.map((exp: any, index: number) => (
            <li key={exp.id || index}>
              <div><span className="font-semibold">{exp.position || exp.role}</span> at {exp.company} <span className="text-xs text-gray-500">({exp.startDate} – {exp.endDate})</span></div>
              <div className="text-xs text-gray-700 ml-2">{exp.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700">Education</div>
        <ul className="list-disc pl-5 space-y-2">
          {education.map((edu: any, index: number) => (
            <li key={edu.id || index}>
              {edu.degree} in {edu.field} at {edu.institution} <span className="text-xs text-gray-500">({edu.startDate} – {edu.endDate})</span>
              {edu.gpa && <span className="ml-2 text-xs">GPA: {edu.gpa}</span>}
            </li>
          ))}
        </ul>
      </div>
      {skills.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="font-bold text-blue-700">Skills</div>
          <div>{renderSkills(skills)}</div>
        </div>
      )}
      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="font-bold text-blue-700">Certifications</div>
        <ul className="list-disc pl-5 space-y-1">
          {certifications.map((cert: any, index: number) => (
            <li key={cert.id || index}>{cert.name} ({cert.issuer}, {cert.date})</li>
          ))}
        </ul>
      </div>
      {languages && languages.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="font-bold text-blue-700">Languages</div>
          <ul className="list-disc pl-5 space-y-1">
            {languages.map((lang: any, index: number) => (
              <li key={lang.id || index}>{lang.language || lang.name} – {lang.proficiency || lang.level}</li>
            ))}
          </ul>
        </div>
      )}
      {references && references.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="font-bold text-blue-700">References</div>
          <ul className="list-disc pl-5 space-y-1">
            {references.map((ref: any, index: number) => (
              <li key={ref.id || index}>
                <div className="font-semibold">{ref.name} - {ref.title}</div>
                <div className="text-xs text-gray-600">{ref.company}</div>
                <div className="text-xs">{ref.email} {ref.phone && `• ${ref.phone}`}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 