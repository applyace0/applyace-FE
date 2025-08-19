import { CVData, CVSettings } from './types';

// Default settings
export const DEFAULT_CV_SETTINGS: CVSettings = {
  maxPagesAllowed: 2,
  allowThreePages: false,
  isHarvardTemplate: false,
  showPageLimitWarning: false,
  trimmedItems: {
    experiences: 0,
    education: 0,
    certifications: 0,
    references: 0,
  },
};

// Harvard template IDs that should always be 1 page
export const HARVARD_TEMPLATES = [
  'harvard-classic',
  'harvard-elite',
  'harvard-modern',
  'academic-research',
  'research-scientist',
];

// Function to determine if a template is Harvard-style
export function isHarvardTemplate(templateId: string): boolean {
  return HARVARD_TEMPLATES.includes(templateId);
}

// Function to get the maximum pages allowed for a template
export function getMaxPagesAllowed(templateId: string, allowThreePages: boolean = false): number {
  if (isHarvardTemplate(templateId)) {
    return 1; // Harvard templates are always 1 page
  }
  return allowThreePages ? 3 : 2;
}

// Function to estimate content length and trim if necessary
export function applyPageLimit(cvData: CVData, templateId: string): CVData {
  // Deep clone to avoid mutating the original cvData
  const originalData = JSON.parse(JSON.stringify(cvData));
  
  const settings = originalData.settings || DEFAULT_CV_SETTINGS;
  const maxPages = getMaxPagesAllowed(templateId, settings.allowThreePages);
  
  // Update settings
  const updatedSettings: CVSettings = {
    ...settings,
    maxPagesAllowed: maxPages,
    isHarvardTemplate: isHarvardTemplate(templateId),
    showPageLimitWarning: false,
    trimmedItems: {
      experiences: 0,
      education: 0,
      certifications: 0,
      references: 0,
    },
  };

  // Estimate content length (less aggressive heuristic)
  const contentLength = estimateContentLength(originalData);
  const estimatedPages = Math.ceil(contentLength / 300); // Less aggressive: 300 words per page

  console.log("🚨 CONTENT LENGTH DEBUG:", {
    contentLength,
    estimatedPages,
    maxPages,
    experiences: originalData.experiences?.length || 0,
    education: originalData.education?.length || 0
  });

  if (estimatedPages <= maxPages) {
    return {
      ...originalData,
      settings: updatedSettings,
    };
  }

  // Content exceeds page limit, need to trim
  const trimmedData = trimContentToFit(originalData, maxPages);
  
  console.log("🚨 APPLY PAGE LIMIT - Original Data:", {
    experiences: originalData.experiences?.length || 0,
    education: originalData.education?.length || 0,
    certifications: originalData.certifications?.length || 0,
    references: originalData.references?.length || 0,
    templateId,
    maxPages,
    estimatedPages
  });
  
  console.log("🚨 APPLY PAGE LIMIT - Trimmed Data:", {
    experiences: trimmedData.experiences?.length || 0,
    education: trimmedData.education?.length || 0,
    certifications: trimmedData.certifications?.length || 0,
    references: trimmedData.references?.length || 0,
    trimmedItems: trimmedData.settings?.trimmedItems
  });
  
  return {
    ...trimmedData,
    settings: {
      ...updatedSettings,
      showPageLimitWarning: true,
    },
  };
}

// Estimate content length based on CV sections
function estimateContentLength(cvData: CVData): number {
  let length = 0;
  
  // Personal info and summary
  if (cvData.personalInfo?.summary) {
    length += cvData.personalInfo.summary.split(' ').length;
  }
  
  // Experiences (weighted heavily)
  if (cvData.experiences && Array.isArray(cvData.experiences)) {
    cvData.experiences.forEach(exp => {
      length += 50; // Base length for each experience
      if (exp.description) {
        length += exp.description.split(' ').length;
      }
    });
  }
  
  // Education
  if (cvData.education && Array.isArray(cvData.education)) {
    cvData.education.forEach(edu => {
      length += 30; // Base length for each education entry
      if (edu.description) {
        length += edu.description.split(' ').length;
      }
    });
  }
  
  // Skills
  if (cvData.skills && Array.isArray(cvData.skills)) {
    length += cvData.skills.length * 5;
  }
  
  // Certifications
  if (cvData.certifications && Array.isArray(cvData.certifications)) {
    cvData.certifications.forEach(cert => {
      length += 20; // Base length for each certification
      if (cert.description) {
        length += cert.description.split(' ').length;
      }
    });
  }
  
  // Languages
  if (cvData.languages && Array.isArray(cvData.languages)) {
    length += cvData.languages.length * 10;
  }
  
  // References
  if (cvData.references && Array.isArray(cvData.references)) {
    cvData.references.forEach(ref => {
      length += 30; // Base length for each reference
    });
  }
  
  // Projects
  if (cvData.projects && Array.isArray(cvData.projects)) {
    cvData.projects.forEach(project => {
      length += 40; // Base length for each project
      if (project.description) {
        length += project.description.split(' ').length;
      }
    });
  }
  
  return length;
}

// Trim content to fit within page limit
function trimContentToFit(cvData: CVData, maxPages: number): CVData {
  const targetLength = maxPages * 600; // Less aggressive target: 600 words per page for better CV content
  let currentLength = estimateContentLength(cvData);
  const trimmedData = { ...cvData };
  const trimmedItems = {
    experiences: 0,
    education: 0,
    certifications: 0,
    references: 0,
  };

  // Priority order for trimming (keep most recent/important items)
  // 1. Allow 4-5 experiences for great CV (for 2-page limit)
  if (maxPages === 2 && trimmedData.experiences && Array.isArray(trimmedData.experiences) && trimmedData.experiences.length > 5) {
    const experiencesToKeep = 5; // Allow 5 experiences for comprehensive CV
    const trimmedCount = trimmedData.experiences.length - experiencesToKeep;
    trimmedData.experiences = trimmedData.experiences.slice(0, experiencesToKeep);
    trimmedItems.experiences = trimmedCount;
    currentLength = estimateContentLength(trimmedData);
  }
  // 2. Trim older experiences only if absolutely necessary
  else if (currentLength > targetLength && trimmedData.experiences && Array.isArray(trimmedData.experiences) && trimmedData.experiences.length > 4) {
    const experiencesToKeep = Math.max(4, Math.floor(trimmedData.experiences.length * 0.8)); // Keep 80% of experiences
    const trimmedCount = trimmedData.experiences.length - experiencesToKeep;
    trimmedData.experiences = trimmedData.experiences.slice(0, experiencesToKeep);
    trimmedItems.experiences = trimmedCount;
    currentLength = estimateContentLength(trimmedData);
  }

  // 2. Trim older education entries
  if (currentLength > targetLength && trimmedData.education && Array.isArray(trimmedData.education) && trimmedData.education.length > 1) {
    const educationToKeep = Math.max(1, Math.floor(trimmedData.education.length * 0.8));
    const trimmedCount = trimmedData.education.length - educationToKeep;
    trimmedData.education = trimmedData.education.slice(0, educationToKeep);
    trimmedItems.education = trimmedCount;
    currentLength = estimateContentLength(trimmedData);
  }

  // 3. Trim certifications
  if (currentLength > targetLength && trimmedData.certifications && Array.isArray(trimmedData.certifications) && trimmedData.certifications.length > 2) {
    const certsToKeep = Math.max(2, Math.floor(trimmedData.certifications.length * 0.8));
    const trimmedCount = trimmedData.certifications.length - certsToKeep;
    trimmedData.certifications = trimmedData.certifications.slice(0, certsToKeep);
    trimmedItems.certifications = trimmedCount;
    currentLength = estimateContentLength(trimmedData);
  }

  // 4. Trim references
  if (currentLength > targetLength && trimmedData.references && Array.isArray(trimmedData.references) && trimmedData.references.length > 2) {
    const refsToKeep = Math.max(2, Math.floor(trimmedData.references.length * 0.8));
    const trimmedCount = trimmedData.references.length - refsToKeep;
    trimmedData.references = trimmedData.references.slice(0, refsToKeep);
    trimmedItems.references = trimmedCount;
    currentLength = estimateContentLength(trimmedData);
  }

  // Update settings with trimmed items info
  trimmedData.settings = {
    ...trimmedData.settings,
    trimmedItems,
  };

  return trimmedData;
}

// Function to check if content exceeds page limit
export function isContentOverLimit(cvData: CVData, templateId: string): boolean {
  const settings = cvData.settings || DEFAULT_CV_SETTINGS;
  const maxPages = getMaxPagesAllowed(templateId, settings.allowThreePages);
  const contentLength = estimateContentLength(cvData);
  const estimatedPages = Math.ceil(contentLength / 800);
  
  return estimatedPages > maxPages;
}

// Function to get page limit warning message
export function getPageLimitWarning(cvData: CVData, templateId: string): string | null {
  const settings = cvData.settings || DEFAULT_CV_SETTINGS;
  
  if (isHarvardTemplate(templateId)) {
    return "⚠️ Harvard templates are limited to 1 page for academic standards.";
  }
  
  if (isContentOverLimit(cvData, templateId)) {
    if (settings.allowThreePages) {
      return "⚠️ You've exceeded the 2-page limit. You can enable 3 pages, but longer CVs may reduce your chances with recruiters.";
    } else {
      return "⚠️ Your CV exceeds the 2-page limit. Consider enabling 3 pages or trimming content for better recruiter engagement.";
    }
  }
  
  return null;
} 