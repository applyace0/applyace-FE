// API Contracts - Shared Types Between Frontend and Backend
// This file ensures total linking and consistency across the application

// ============================================================================
// JOB POSTING TYPES
// ============================================================================

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  keywords: string[];
  salary_range?: string;
  application_url: string;
  posted_date: string;
  job_board?: string;
  // Enhanced fields from AI analysis
  ai_enhanced?: boolean;
  skill_categories?: {
    technical?: string[];
    soft_skills?: string[];
    tools?: string[];
    methodologies?: string[];
  };
  experience_level_analysis?: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  industry_focus?: string;
  remote_work_compatibility?: 'remote' | 'hybrid' | 'on-site';
  salary_insights?: string;
  application_tips?: string;
  // Additional fields
  employment_type?: string;
  experience_level?: string;
  company_size?: string;
  industry?: string;
  benefits?: string[];
}

// ============================================================================
// CV DATA TYPES
// ============================================================================

export interface WorkExperience {
  id?: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
  location?: string;
  description?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Language {
  id?: string;
  language: string;
  proficiency: string;
}

export interface Reference {
  id?: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface CVData {
  id: string;
  user_id: string;
  full_name: string;
  job_title: string;
  email: string;
  phone?: string;
  location: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary: string;
  experiences: WorkExperience[];
  education: Education[];
  projects?: Project[];
  skills: string;
  languages?: Language[];
  certifications?: string;
  references?: Reference[];
  template_id?: string;
  is_primary?: boolean;
  ats_score?: number;
  content_type?: 'manual' | 'uploaded' | 'ai_generated';
  created_at?: string;
  updated_at?: string;
  industry?: string;
  target_role?: string;
  keywords?: string[];
  // Fallback fields for compatibility
  base_experiences?: WorkExperience[];
}

// ============================================================================
// AI ANALYSIS TYPES
// ============================================================================

export interface AISuggestion {
  type: 'skill' | 'experience' | 'summary' | 'keyword';
  suggestion: string;
  confidence: number;
  reasoning: string;
}

export interface MatchAnalysis {
  overall_match_score: number;
  skills_match: {
    score: number;
    matching_skills: string[];
    missing_skills: string[];
  };
  strengths: string[];
  recommendations: string[];
  interview_probability: number;
  ai_powered: boolean;
}

export interface TailoredCVResult {
  tailored_cv: CVData;
  optimization_notes: {
    match_score: number;
    improvements_made: string[];
    ai_powered: boolean;
    compliance_score?: number;
    compliance_issues?: string[];
    compliance_suggestions?: string[];
  };
}

export interface CoverLetterResult {
  cover_letter: string;
  ai_powered: boolean;
  customization_notes: string[];
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// Job Scraping
export interface JobScrapingRequest {
  jobUrl: string;
}

export interface JobScrapingResponse {
  success: boolean;
  data: JobPosting;
  ai_enhanced: boolean;
  job_board: string;
  note?: string;
  error?: string;
}

// AI CV Tailoring
export interface AITailoringRequest {
  cvData: CVData;
  jobData: JobPosting;
  action: 'tailor-cv' | 'generate-cover-letter' | 'analyze-match';
}

export interface AITailoringResponse {
  success: boolean;
  action: string;
  data: TailoredCVResult | CoverLetterResult | MatchAnalysis;
  note?: string;
  error?: string;
}

// ============================================================================
// JOB APPLICATION TYPES
// ============================================================================

export interface JobApplication {
  id?: string;
  user_id?: string;
  job_title: string;
  company_name: string;
  job_url?: string;
  job_description?: string;
  application_date?: string;
  status: 'draft' | 'applied' | 'interviewed' | 'offered' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  salary_range?: string;
  location?: string;
  job_type?: string;
  notes?: string;
  follow_up_date?: string;
  interview_scheduled?: boolean;
  interview_date?: string;
  interview_notes?: string;
  feedback?: string;
  match_score?: number;
  requirements_met?: any;
  cover_letter?: string;
  created_at?: string;
  updated_at?: string;
  cv_data?: any; // jsonb
  cv_reference?: string; // text
}

// ============================================================================
// API ENDPOINTS CONFIGURATION
// ============================================================================

export const API_ENDPOINTS = {
  // Base URLs
  BACKEND_BASE: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || '/api'),
  FRONTEND_BASE: 'http://localhost:3001',
  
  // Job Scraping
  SCRAPE_JOB: '/api/jobs/scrape-job',
  
  // AI Services
  AI_TAILOR_CV: '/api/ai/tailor-cv',
  
  // Stripe
  STRIPE_CHECKOUT: '/api/stripe/create-checkout-session',
  STRIPE_WEBHOOK: '/api/stripe/webhook',
  
  // Health
  HEALTH_CHECK: '/api/health',
} as const;

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface APIError {
  error: string;
  message?: string;
  details?: any;
  status?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type StepStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface StepStatusMap {
  scrape: StepStatus;
  analyze: StepStatus;
  tailor: StepStatus;
  apply: StepStatus;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const JOB_POSTING_VALIDATION = {
  required: ['id', 'title', 'company', 'location', 'description', 'requirements', 'keywords', 'application_url', 'posted_date'],
  optional: ['salary_range', 'job_board', 'ai_enhanced', 'skill_categories', 'experience_level_analysis', 'industry_focus', 'remote_work_compatibility', 'salary_insights', 'application_tips', 'employment_type', 'experience_level', 'company_size', 'industry', 'benefits']
} as const;

export const CV_DATA_VALIDATION = {
  required: ['id', 'user_id', 'full_name', 'job_title', 'email', 'location', 'summary', 'experiences', 'education', 'skills'],
  optional: ['phone', 'linkedin_url', 'portfolio_url', 'projects', 'languages', 'certifications', 'references', 'template_id', 'is_primary', 'ats_score', 'content_type', 'created_at', 'updated_at', 'industry', 'target_role', 'keywords', 'base_experiences']
} as const; 