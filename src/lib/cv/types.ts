// Core CV Builder Types - Scalable and Type-Safe
// Following PRD requirements for complete career pipeline

export interface PersonalInfo {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  title?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface Experience {
  id?: string;
  company: string;
  role?: string;
  position?: string;
  duration?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  highlights?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field?: string;
  year?: string;
  gpa?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level?: string;
  category?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer?: string;
  date?: string;
  expiryDate?: string;
  description?: string;
}

export interface Language {
  id?: string;
  name?: string;
  language?: string;
  level?: string;
  proficiency?: string;
  certification_name?: string;
}

export interface Reference {
  id?: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  technologies?: string[] | string;
  link?: string;
  url?: string;
  date?: string;
}

export interface CVSettings {
  maxPagesAllowed: number;
  allowThreePages: boolean;
  isHarvardTemplate: boolean;
  showPageLimitWarning: boolean;
  trimmedItems: {
    experiences: number;
    education: number;
    certifications: number;
    references: number;
  };
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[] | string[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  references?: Reference[];
  settings?: CVSettings;
  isSampleDatabase?: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'professional' | 'executive' | 'creative' | 'academic' | 'modern' | 'minimalist' | 'tech' | 'business' | 'healthcare' | 'minimal' | 'classic' | 'attractive' | 'clean' | 'aesthetic' | 'stunning' | 'elegant' | 'comprehensive' | 'consulting' | 'research' | 'board' | 'founder' | 'global' | 'ceo';
  tier: 'free' | 'payg' | 'starter' | 'professional' | 'career_pro' | 'elite_executive';
  preview: string;
  layout: 'single-column' | 'two-column' | 'classic' | 'modern' | 'creative';
  features: string[];
  fontFamily: string;
  colorScheme: string;
  atsScore: number;
  headerAlign: 'center' | 'left' | 'right';
  sectionDivider: 'solid' | 'dashed' | 'horizontal';
  listStyle: 'bullet' | 'dash' | 'minimal' | 'arrow' | 'check' | 'circle' | 'star' | 'creative' | 'tech' | 'diamond' | 'heart' | 'cross' | 'code' | 'globe' | 'premium';
  headingStyle: 'uppercase' | 'titlecase' | 'normal';
  skillsDisplay: 'bold' | 'tags' | 'underlined' | 'inline' | 'italic' | 'normal';
  pageCount: number;
}

export interface AISuggestion {
  id: string;
  type: 'summary' | 'experience' | 'skills' | 'keywords' | 'optimization';
  title: string;
  description: string;
  suggested_text?: string;
  confidence_score: number;
  applied: boolean;
  created_at: string;
}

export interface CVBuilderState {
  currentStep: number;
  totalSteps: number;
  formData: Partial<CVData>;
  selectedTemplate: string;
  isPreviewMode: boolean;
  isAnalyzing: boolean;
  validationErrors: ValidationError[];
  aiSuggestions: AISuggestion[];
  autoSaveStatus: 'saved' | 'saving' | 'error';
  lastSaved: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  isRequired: boolean;
  isComplete: boolean;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'url' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface CVLibraryState {
  cvs: CVData[];
  selectedCV: CVData | null;
  isEditing: boolean;
  searchQuery: string;
  filterBy: 'all' | 'primary' | 'industry' | 'template';
  sortBy: 'name' | 'created' | 'updated' | 'ats_score';
}

// LinkedIn Integration Types
export interface LinkedInJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary_range?: string;
  application_url: string;
  posted_date: string;
  application_count: number;
}

export interface JobApplication {
  id: string;
  cv_id: string;
  job_id: string;
  job_title: string;
  company: string;
  application_date: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  interview_date?: string;
  notes?: string;
  success_score?: number;
}

// AI Analysis Types
export interface CVAnalysis {
  id: string;
  cv_id: string;
  ats_score: number;
  keyword_match: number;
  readability_score: number;
  suggestions: AISuggestion[];
  industry_fit: string[];
  improvement_areas: string[];
  strengths: string[];
  created_at: string;
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt';
  template: string;
  include_analysis?: boolean;
  watermark?: boolean;
  custom_filename?: string;
}

// Form Field Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'checkbox';
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: { value: string; label: string }[];
  helpText?: string;
  maxLength?: number;
}

// Step Configuration
export const CV_BUILDER_STEPS: StepConfig[] = [
  {
    id: 0,
    title: 'Choose Template',
    description: 'Select a professional template that matches your industry',
    isRequired: true,
    isComplete: false
  },
  {
    id: 1,
    title: 'Personal Information',
    description: 'Add your basic contact and professional details',
    isRequired: true,
    isComplete: false,
    validationRules: [
      { field: 'full_name', type: 'required', message: 'Full name is required' },
      { field: 'email', type: 'email', message: 'Valid email is required' },
      { field: 'job_title', type: 'required', message: 'Job title is required' }
    ]
  },
  {
    id: 2,
    title: 'Professional Summary',
    description: 'Write a compelling summary of your experience and goals',
    isRequired: true,
    isComplete: false,
    validationRules: [
      { field: 'summary', type: 'required', message: 'Professional summary is required' },
      { field: 'summary', type: 'minLength', value: 50, message: 'Summary should be at least 50 characters' }
    ]
  },
  {
    id: 3,
    title: 'Work Experience',
    description: 'Add your relevant work experience and achievements',
    isRequired: true,
    isComplete: false
  },
  {
    id: 4,
    title: 'Education',
    description: 'Include your educational background and certifications',
    isRequired: false,
    isComplete: false
  },
  {
    id: 5,
    title: 'Skills & Languages',
    description: 'List your technical skills, soft skills, and languages',
    isRequired: false,
    isComplete: false
  },
  {
    id: 6,
    title: 'Projects & Achievements',
    description: 'Showcase your projects and notable achievements',
    isRequired: false,
    isComplete: false
  },
  {
    id: 7,
    title: 'AI Analysis',
    description: 'Get AI-powered suggestions to improve your CV',
    isRequired: false,
    isComplete: false
  },
  {
    id: 8,
    title: 'Preview & Save',
    description: 'Review your CV and save or export',
    isRequired: true,
    isComplete: false
  }
]; 

