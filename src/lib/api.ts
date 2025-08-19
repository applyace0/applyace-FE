import { supabase } from '@/lib/supabase';

// API Base URL configuration
// In development, always use relative paths to go through the Vite proxy
export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || '/api');

// Get authentication token from Supabase session
export async function getAuthToken(): Promise<string | null> {
  try {
    console.log('🔍 DEBUG: Getting auth token...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('🔍 DEBUG: Session data:', session);
    console.log('🔍 DEBUG: Session error:', error);
    
    if (error) {
      console.error('❌ Error getting session:', error);
      return null;
    }
    
    if (!session) {
      console.warn('⚠️ No session found - user may not be logged in');
      return null;
    }
    
    console.log('✅ Token found:', session.access_token ? 'Present' : 'Missing');
    return session.access_token || null;
  } catch (error) {
    console.error('❌ Error getting auth token:', error);
    return null;
  }
}

// Centralized authenticated fetch function
export async function authenticatedFetch(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  console.log('🔍 DEBUG: Making authenticated request to:', endpoint);
  console.log('🔍 DEBUG: Token present:', !!token);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  console.log('🔍 DEBUG: Request headers:', headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log('🔍 DEBUG: Response status:', response.status);
  console.log('🔍 DEBUG: Response headers:', Object.fromEntries(response.headers.entries()));

  // Handle authentication errors
  if (response.status === 401) {
    console.error('❌ Authentication failed. User may need to log in again.');
    // Optionally redirect to login
    // window.location.href = '/auth';
  }

  return response;
}

// CV API functions
export const cvAPI = {
  create: async (cvData: any) => {
    console.log('🔍 DEBUG: Creating CV with data:', cvData);
    const response = await authenticatedFetch('/api/cv/create', {
      method: 'POST',
      body: JSON.stringify(cvData),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create CV' }));
      console.error('❌ CV creation failed:', error);
      throw new Error(error.message || 'Failed to create CV');
    }
    
    const result = await response.json();
    console.log('✅ CV created successfully:', result);
    return result;
  },

  update: async (cvId: string, cvData: any) => {
    const response = await authenticatedFetch(`/api/cv/${cvId}`, {
      method: 'PUT',
      body: JSON.stringify(cvData),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update CV' }));
      throw new Error(error.message || 'Failed to update CV');
    }
    
    return response.json();
  },

  getAll: async () => {
    const response = await authenticatedFetch('/api/cv');
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch CVs' }));
      throw new Error(error.message || 'Failed to fetch CVs');
    }
    
    return response.json();
  },

  getById: async (cvId: string) => {
    const response = await authenticatedFetch(`/api/cv/${cvId}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch CV' }));
      throw new Error(error.message || 'Failed to fetch CV');
    }
    
    return response.json();
  },

  delete: async (cvId: string) => {
    const response = await authenticatedFetch(`/api/cv/${cvId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete CV' }));
      throw new Error(error.message || 'Failed to delete CV');
    }
    
    return response.json();
  },

  upload: async (formData: FormData) => {
    console.log('🔍 DEBUG: Uploading CV file...');
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/cv/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });
    
    console.log('🔍 DEBUG: Upload response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to upload CV' }));
      console.error('❌ CV upload failed:', error);
      throw new Error(error.message || 'Failed to upload CV');
    }
    
    const result = await response.json();
    console.log('✅ CV uploaded successfully:', result);
    return result;
  },

  parse: async (formData: FormData) => {
    console.log('🔍 DEBUG: Parsing CV file...');
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/cv/parse`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });
    
    console.log('🔍 DEBUG: Parse response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to parse CV' }));
      console.error('❌ CV parsing failed:', error);
      throw new Error(error.message || 'Failed to parse CV');
    }
    
    const result = await response.json();
    console.log('✅ CV parsed successfully:', result);
    return result;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.ok;
}; 