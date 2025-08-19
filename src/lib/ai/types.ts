// AI Provider Types
export type AIProvider = 'openai' | 'gemini' | 'claude' | 'local';

export interface AIProviderConfig {
  name: string;
  displayName: string;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  costPerToken: number;
  maxTokens: number;
  freeTier: boolean;
  description: string;
}

export type AIProviderConfigs = {
  [key in AIProvider]: AIProviderConfig;
};

// CV Analysis Types
export interface CVAnalysisRequest {
  cvText: string;
  jobDescription?: string;
  analysisType: 'basic' | 'detailed' | 'premium';
  userId: string;
  cvId: string;
}

export interface CVAnalysisResponse {
  id: string;
  cvId: string;
  userId: string;
  provider: AIProvider;
  model: string;
  analysisType: 'basic' | 'detailed' | 'premium';
  
  // Core Analysis Results
  overallScore: number; // 0-100
  atsCompatibility: number; // 0-100
  readabilityScore: number; // 0-100
  
  // Detailed Scores
  scores: {
    formatting: number;
    keywords: number;
    experience: number;
    skills: number;
    education: number;
    achievements: number;
  };
  
  // Analysis Results
  strengths: string[];
  weaknesses: string[];
  suggestions: CVSuggestion[];
  
  // Keywords Analysis
  missingKeywords: string[];
  presentKeywords: string[];
  keywordDensity: number;
  
  // Industry Insights
  industryMatch?: number;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Metadata
  analysisDate: string;
  processingTime: number; // milliseconds
  tokenUsage: {
    input: number;
    output: number;
    cost: number;
  };
}

export interface CVSuggestion {
  id: string;
  category: 'formatting' | 'content' | 'keywords' | 'structure' | 'skills';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  example?: string;
  impact: string; // Expected improvement description
}

// Usage Tracking
export interface AIUsage {
  userId: string;
  provider: AIProvider;
  model: string;
  tokensUsed: number;
  cost: number;
  analysisType: string;
  timestamp: string;
  success: boolean;
}

// User AI Settings
export interface UserAISettings {
  preferredProvider: AIProvider;
  analysisLevel: 'basic' | 'detailed' | 'premium';
  autoAnalyze: boolean;
  emailNotifications: boolean;
  monthlyUsageLimit?: number;
}

// Error Types
export interface AIError {
  code: string;
  message: string;
  provider: AIProvider;
  retryable: boolean;
  timestamp: string;
} 