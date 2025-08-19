// Canonical CV normalization utility for ApplyAce
import { CVData } from './types';

/**
 * Normalize any CV data object to a fully type-safe, PRD-compliant CVData object.
 * Handles string/array conversions, default values, and missing fields.
 * 
 * This function handles both:
 * 1. Frontend format (personalInfo.fullName) -> Backend format (full_name)
 * 2. Backend format (full_name) -> Frontend format (personalInfo.fullName)
 * 3. Database format (content field contains full JSON) -> Frontend format
 */
export function normalizeCVData(input: any): CVData {
  // Helper function to trim and clean strings
  const cleanString = (str: any): string => {
    if (typeof str !== 'string') return '';
    return str.trim();
  };

  // Helper function to clean date strings
  const cleanDate = (date: any): string => {
    if (!date) return '';
    const cleaned = cleanString(date);
    // Basic date validation - if it looks like a date, return it
    if (cleaned && (cleaned.includes('-') || cleaned.includes('/') || cleaned.length >= 4)) {
      return cleaned;
    }
    return '';
  };

  // Handle database format where data is stored in content field
  let dataToProcess = input;
  if (input.content && typeof input.content === 'string') {
    try {
      const parsedContent = JSON.parse(input.content);
      dataToProcess = { ...input, ...parsedContent };
    } catch (error) {
      console.error('Failed to parse CV content:', error);
    }
  }

  // Handle both frontend and backend formats
  const personalInfo = {
    fullName: cleanString(
      dataToProcess.personalInfo?.fullName || 
      dataToProcess.fullName || 
      dataToProcess.full_name || 
      dataToProcess.name || 
      ''
    ),
    email: cleanString(
      dataToProcess.personalInfo?.email || 
      dataToProcess.email || 
      ''
    ),
    phone: cleanString(
      dataToProcess.personalInfo?.phone || 
      dataToProcess.phone || 
      ''
    ),
    location: cleanString(
      dataToProcess.personalInfo?.location || 
      dataToProcess.location || 
      ''
    ),
    linkedin: cleanString(
      dataToProcess.personalInfo?.linkedin || 
      dataToProcess.linkedin || 
      dataToProcess.linkedIn || 
      dataToProcess.linkedin_url || 
      ''
    ),
    website: cleanString(
      dataToProcess.personalInfo?.website || 
      dataToProcess.website || 
      dataToProcess.portfolio_url || 
      ''
    ),
    summary: cleanString(
      dataToProcess.personalInfo?.summary || 
      dataToProcess.summary || 
      ''
    ),
  };

  return {
    personalInfo,
    experiences: Array.isArray(dataToProcess.experiences || dataToProcess.experience)
      ? (dataToProcess.experiences || dataToProcess.experience).map((exp: any, i: number) => ({
          id: exp.id || String(i),
          company: cleanString(exp.company || ''),
          position: cleanString(exp.position || exp.role || ''),
          location: cleanString(exp.location || ''),
          startDate: cleanDate(exp.startDate || exp.start_date || ''),
          endDate: cleanDate(exp.endDate || exp.end_date || ''),
          current: typeof exp.current === 'boolean' ? exp.current : false,
          description: cleanString(exp.description || ''),
        }))
      : [],
    education: Array.isArray(dataToProcess.education)
      ? dataToProcess.education.map((edu: any, i: number) => ({
          id: edu.id || String(i),
          institution: cleanString(edu.institution || ''),
          degree: cleanString(edu.degree || ''),
          field: cleanString(edu.field || edu.field_of_study || ''),
          startDate: cleanDate(edu.startDate || edu.start_date || ''),
          endDate: cleanDate(edu.endDate || edu.end_date || ''),
          gpa: cleanString(edu.gpa || ''),
        }))
      : [],
    skills: Array.isArray(dataToProcess.skills)
      ? dataToProcess.skills.map((skill: any) => {
          if (typeof skill === 'string') return { id: String(Math.random()), name: cleanString(skill) };
          if (skill && typeof skill === 'object' && skill.name) {
            return { id: skill.id || String(Math.random()), name: cleanString(skill.name), level: cleanString(skill.level || '') };
          }
          return { id: String(Math.random()), name: String(skill) };
        }).filter(skill => skill.name)
      : [],
    certifications: Array.isArray(dataToProcess.certifications)
      ? dataToProcess.certifications.map((cert: any, i: number) => ({
          id: cert.id || String(i),
          name: cleanString(cert.name || cert || ''),
          issuer: cleanString(cert.issuer || ''),
          date: cleanDate(cert.date || ''),
          expiryDate: cleanDate(cert.expiryDate || ''),
        }))
      : typeof dataToProcess.certifications === 'string' && dataToProcess.certifications.trim() !== ''
      ? dataToProcess.certifications.split(',').map((c: string, i: number) => ({
          id: String(i),
          name: cleanString(c),
          issuer: '',
          date: '',
        }))
      : [],
    projects: Array.isArray(dataToProcess.projects)
      ? dataToProcess.projects.map((proj: any, i: number) => ({
          id: proj.id || String(i),
          name: cleanString(proj.name || ''),
          description: cleanString(proj.description || ''),
          technologies: Array.isArray(proj.technologies) ? proj.technologies : [cleanString(proj.technologies || '')],
          link: cleanString(proj.link || proj.url || ''),
          date: cleanString(proj.date || ''),
        }))
      : [],
    languages: Array.isArray(dataToProcess.languages)
      ? dataToProcess.languages.map((lang: any, i: number) => ({
          id: lang.id || String(i),
          language: cleanString(lang.language || lang || ''),
          proficiency: cleanString(lang.proficiency || lang.level || ''),
          certified: typeof lang.certified === 'boolean' ? lang.certified : undefined,
          certification_name: cleanString(lang.certification_name || ''),
        }))
      : [],
    references: Array.isArray(dataToProcess.references)
      ? dataToProcess.references.map((ref: any, i: number) => ({
          id: ref.id || String(i),
          name: cleanString(ref.name || ''),
          title: cleanString(ref.title || ''),
          company: cleanString(ref.company || ''),
          email: cleanString(ref.email || ''),
          phone: cleanString(ref.phone || ''),
          relationship: cleanString(ref.relationship || ''),
        }))
      : [],
  };
} 