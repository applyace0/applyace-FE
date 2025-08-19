import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Keep a single client across HMR reloads
const g = globalThis as unknown as { __sb?: SupabaseClient };
export const supabase = g.__sb ?? createClient(url, key);
if (!g.__sb) g.__sb = supabase;

// CV Types
export interface CVData {
  id: string;
  user_id: string;
  title?: string;
  cv_filename?: string;
  full_name: string;
  job_title?: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary: string;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    url: string;
  }>;
  skills: string;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: string;
  references?: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
  template_id?: string;
  is_primary?: boolean;
  ats_score?: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  content_type?: string;
  content?: any; // Add content field for builder CVs
  created_at: string;
  updated_at: string;
}

// Interview Types
export interface InterviewSession {
  id: string;
  user_id: string;
  session_type: 'practice' | 'mock' | 'simulation' | 'assessment';
  industry?: string;
  job_role?: string;
  difficulty_level: number;
  questions_total: number;
  questions_answered: number;
  confidence_score: number;
  overall_rating: number;
  duration_minutes: number;
  session_status: 'active' | 'completed' | 'paused' | 'abandoned';
  ai_feedback: any;
  improvement_areas: string[];
  strengths: string[];
  recommendations: string[];
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  category: string;
  subcategory?: string;
  industry?: string;
  job_role?: string;
  difficulty: number;
  question_type: 'behavioral' | 'technical' | 'situational' | 'case-study' | 'general';
  question_text: string;
  question_context?: string;
  sample_answer?: string;
  sample_keywords: string[];
  evaluation_criteria: any;
  tags: string[];
  is_active: boolean;
  usage_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  response_text?: string;
  response_audio_url?: string;
  response_video_url?: string;
  response_duration_seconds: number;
  confidence_score: number;
  clarity_score: number;
  relevance_score: number;
  structure_score: number;
  overall_score: number;
  ai_feedback: any;
  improvement_suggestions: string[];
  keywords_used: string[];
  keywords_missing: string[];
  response_status: 'started' | 'completed' | 'skipped' | 'timeout';
  created_at: string;
}

// CV Database Operations
export const cvOperations = {
  async createCV(cvData: Omit<CVData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Creating CV with data:', cvData);

    // Create base insert data with only guaranteed columns
    const baseInsertData = {
      user_id: user.id,
      full_name: cvData.full_name || 'Untitled CV',
      email: cvData.email || '',
      phone: cvData.phone || '',
      location: cvData.location || '',
      summary: cvData.summary || '',
      experiences: cvData.experiences || [],
      education: cvData.education || [],
      skills: cvData.skills || [],
      certifications: cvData.certifications || '',
    };

    // Add optional columns only if they exist in the data
    const insertData: any = { ...baseInsertData };
    
    // Add file-related fields if they exist
    if (cvData.file_url) insertData.file_url = cvData.file_url;
    if (cvData.file_name) insertData.file_name = cvData.file_name;
    if (cvData.file_size) insertData.file_size = cvData.file_size;
    
    // Add other optional fields with defaults
    if ('template_id' in cvData) insertData.template_id = cvData.template_id || 'modern';
    if ('is_primary' in cvData) insertData.is_primary = cvData.is_primary || false;
    if ('ats_score' in cvData) insertData.ats_score = cvData.ats_score || 0;
    if ('content_type' in cvData) insertData.content_type = cvData.content_type || 'manual';

    console.log('Inserting CV data:', insertData);

    const { data, error } = await supabase
      .from('cvs')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('CV creation error:', error);
      throw error;
    }

    console.log('CV created successfully:', data);
    return data;
  },

  // Simplified version that only uses core fields
  async createSimpleCV(cvData: {
    full_name: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    experiences?: any[];
    education?: any[];
    skills?: string[];
    certifications?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const insertData = {
      user_id: user.id,
      full_name: cvData.full_name,
      email: cvData.email || '',
      phone: cvData.phone || '',
      location: cvData.location || '',
      summary: cvData.summary || '',
      experiences: cvData.experiences || [],
      education: cvData.education || [],
      skills: cvData.skills || [],
      certifications: cvData.certifications || '',
    };

    const { data, error } = await supabase
      .from('cvs')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Simple CV creation error:', error);
      throw error;
    }

    return data;
  },

  async updateCV(id: string, cvData: Partial<CVData>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .update(cvData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async getCV(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllCVs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map database data back to the old CVData format that the CVs page expects
    const mappedCVs = (data || []).map(dbCV => {
      // Extract CV content from parsed_data field
      let cvContent = null;
      if (dbCV.parsed_data) {
        let raw = dbCV.parsed_data;
        // Unwrap accidental nesting: { title, templateId, builder: {...actual...} }
        if (raw && typeof raw === "object" && raw.builder && !raw.personalInfo) {
          raw = raw.builder;
        }
        cvContent = raw;
      }
      
      return {
        id: dbCV.id,
        user_id: dbCV.user_id,
        title: dbCV.title || dbCV.cv_filename || 'Untitled CV',
        cv_filename: dbCV.cv_filename,
        full_name: dbCV.full_name || '',
        job_title: dbCV.job_title,
        email: dbCV.email || '',
        phone: dbCV.phone || '',
        location: dbCV.location || '',
        linkedin_url: dbCV.linkedin_url,
        portfolio_url: dbCV.portfolio_url,
        summary: dbCV.summary || '',
        experiences: dbCV.experiences || [],
        education: dbCV.education || [],
        projects: dbCV.projects || [],
        skills: dbCV.skills || '',
        languages: dbCV.languages || [],
        certifications: dbCV.certifications || '',
        references: dbCV.references || [],
        template_id: dbCV.template_id,
        is_primary: dbCV.is_primary,
        ats_score: dbCV.ats_score,
        file_url: dbCV.file_url,
        file_name: dbCV.file_name,
        file_size: dbCV.file_size,
        content_type: dbCV.content_type,
        content: cvContent, // Use the extracted parsed_data
        created_at: dbCV.created_at,
        updated_at: dbCV.updated_at
      };
    });
    
    return mappedCVs;
  },

  async deleteCV(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }
};

export async function fetchUserCV(userId: string) {
  const { data, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

export async function upsertUserCV(userId: string, cvData: any) {
  const { data, error } = await supabase
    .from('cvs')
    .upsert({ user_id: userId, content: cvData }, { onConflict: 'user_id' });
  return { data, error };
}

// Interview Database Operations
export const interviewOperations = {
  async createSession(sessionData: Omit<InterviewSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({ ...sessionData, user_id: user.id })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async updateSession(id: string, sessionData: Partial<InterviewSession>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interview_sessions')
      .update(sessionData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSessions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getQuestions(filters?: { category?: string; industry?: string; difficulty?: number; limit?: number }) {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createResponse(responseData: Omit<UserResponse, 'id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_responses')
      .insert({ ...responseData, user_id: user.id })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }

    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
};

// Storage operations
export const storageOperations = {
  async uploadFile(file: File, bucket: string = 'cvs'): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('File upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async createBucket(bucketName: string) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (error) {
        console.log('Bucket creation error (may already exist):', error);
      } else {
        console.log('Bucket created successfully:', bucketName);
      }
    } catch (error) {
      console.log('Bucket creation failed:', error);
    }
  },

  async listBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Error listing buckets:', error);
      return [];
    }
    return data || [];
  }
}; 