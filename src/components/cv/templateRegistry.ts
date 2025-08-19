import { MinimalCleanTemplate } from './templates/MinimalCleanTemplate';
import { ModernProfessionalTemplate } from './templates/ModernProfessionalTemplate';
import { ProfessionalSimpleTemplate } from './templates/ProfessionalSimpleTemplate';

export const TEMPLATES = {
  'minimal-clean': MinimalCleanTemplate,
  'modern-professional': ModernProfessionalTemplate,
  'professional-simple': ProfessionalSimpleTemplate,
  // Add other templates as needed
};

// Back-compat aliases (old slugs → new slugs)
const ALIASES: Record<string, string> = {
  modern: 'modern-professional',
  professional: 'professional-simple',
  minimal: 'minimal-clean',
  'basic-modern': 'modern-professional',  // your logs show this slug
};

export function resolveTemplateId(id?: string) {
  if (!id) return 'minimal-clean';
  return TEMPLATES[id] ? id : (ALIASES[id] || 'minimal-clean');
}
