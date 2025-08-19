import React from 'react';

export function TwoColumnExecutiveTemplate({ data }: { data: any }) {
  const { personalInfo = {}, experiences = [], education = [], skills = [], certifications = [], languages = [], references = [] } = data || {};
  const renderSkills = (skills: any) => {
    if (!skills) return [];
    if (Array.isArray(skills)) {
      return skills.map((skill: any) => {
        if (typeof skill === 'string') return skill;
        if (skill && typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
      });
    }
    if (typeof skills === 'string') return skills.split(',').map((s: string) => s.trim());
    return [];
  };
  return (
    <div className="bg-white p-8 rounded shadow text-gray-900 max-w-4xl mx-auto space-y-6 font-[Inter]">
      {/* Header */}
      <div className="mb-4 text-center border-b border-gray-200 pb-2">
        <div className="text-2xl font-bold mb-1">{personalInfo?.fullName || ''}</div>
        <div className="text-sm text-gray-700 space-y-1">
          {personalInfo?.email && <div>{personalInfo.email}</div>}
          {personalInfo?.phone && <div>{personalInfo.phone}</div>}
          {personalInfo?.location && <div>{personalInfo.location}</div>}
          {(personalInfo?.linkedin || personalInfo?.website) && (
            <div className="flex justify-center gap-4 text-gray-600">
              {personalInfo?.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a>
              )}
              {personalInfo?.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">{personalInfo.website}</a>
              )}
            </div>
          )}
        </div>
        {personalInfo?.summary && (
          <div className="mt-3 italic text-gray-700">{personalInfo.summary}</div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Skills, Certifications, Languages, References */}
        <div className="space-y-6">
          {skills && skills.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-gray-700 text-lg mb-2">Skills</div>
              <div className="flex flex-wrap gap-1">
                {renderSkills(skills).map((skill: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          )}
          
          {certifications && certifications.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-gray-700 text-lg mb-2">Certifications</div>
              <ul className="list-disc pl-8 space-y-2">
                {certifications.map((cert: any, idx: number) => (
                  <li key={idx}>{cert.name} – {cert.issuer} ({cert.date})</li>
                ))}
              </ul>
            </div>
          )}

          {data.languages?.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-gray-700 text-lg mb-2">Languages</div>
              <ul className="list-disc pl-8 space-y-2">
                {data.languages.map((lang: any, idx: number) => (
                  <li key={idx}>{lang.name} – {lang.proficiency}</li>
                ))}
              </ul>
            </div>
          )}

          {data.references?.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-gray-700 text-lg mb-2">References</div>
              <ul className="space-y-3">
                {data.references.map((ref: any, idx: number) => (
                  <li key={idx}>
                    <div className="font-semibold"><strong>{ref.name}</strong>, {ref.title} at {ref.company}</div>
                    <div className="text-xs">{ref.email} | {ref.phone}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Experience and Education */}
        <div className="space-y-6">
          {experiences && experiences.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-gray-700 text-lg mb-2">Experience</div>
              <ul className="space-y-4">
                {experiences.map((exp: any, idx: number) => (
                  <li key={idx}>
                    <div className="font-semibold">{exp.position} – {exp.company}</div>
                    <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate} | {exp.location}</div>
                    <div className="text-sm mt-1">{exp.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {education && education.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="font-bold text-gray-700 text-lg mb-2">Education</div>
              <ul className="space-y-3">
                {education.map((edu: any, idx: number) => (
                  <li key={idx}>
                    <div className="font-semibold">{edu.degree} – {edu.institution}</div>
                    <div className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</div>
                    <div className="text-xs">{edu.field}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 