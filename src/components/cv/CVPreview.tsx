import React, { useMemo } from 'react';
import { normalizeBuilder } from '@/lib/cvNormalize';
import { resolveTemplateId, TEMPLATES } from './templateRegistry';
import { applyPageLimit } from '@/lib/cv/pageLimit';

// serverCv is whatever you pass from CVPreviewModal after GET /api/cv/:id
type Props = {
  serverCv?: { title?: string; template_id?: string; data?: any };
  cvData?: any;        // legacy local shape
  selectedTemplate?: string;
  settings?: { maxPages?: number };
};

export default function CVPreview({ serverCv, cvData, selectedTemplate, settings }: Props) {
  // Use the centralized normalization that handles all data shapes
  const model = normalizeBuilder(serverCv || cvData);

  // Debug: log the normalized model
  console.debug('CVPreview::normalized model:', {
    hasPersonalInfo: model.personalInfo ? true : false,
    hasExperiences: model.experiences ? model.experiences.length : 0,
    hasEducation: model.education ? model.education.length : 0,
    hasSkills: model.skills ? model.skills.length : 0,
    modelKeys: Object.keys(model),
    model
  });

  const templateId = resolveTemplateId(
    selectedTemplate || model.templateId || serverCv?.template_id || 'minimal-clean'
  );

  const Template = TEMPLATES[templateId];

  const headerTitle =
    serverCv?.title ||
    model.personalInfo?.fullName ||
    'Untitled';

  // Use the CORRECT page limiting system for PREVIEW only (2-page limit)
  const renderData = useMemo(
    () => applyPageLimit(model as any, selectedTemplate || 'modern-professional'),
    [model, selectedTemplate]
  );

  console.debug('CVPreview::counts', {
    exp: (renderData?.experiences ?? []).length,
    edu: (renderData?.education ?? []).length,
    skills: (renderData?.skills ?? []).length,
    certs: (renderData?.certifications ?? []).length,
  });

  if (!Template) {
    return <div>Template not found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{headerTitle}</h2>
      <Template data={renderData} />
    </div>
  );
} 