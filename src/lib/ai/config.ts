import { AIProviderConfigs } from './types';

export const AI_PROVIDERS: AIProviderConfigs = {
  openai: {
    name: 'openai',
    displayName: 'OpenAI GPT-4o Mini',
    model: 'gpt-4o-mini',
    costPerToken: 0.00000015, // $0.15/1M input tokens
    maxTokens: 16384,
    freeTier: true, // $5 credit for new accounts
    description: 'Most cost-effective AI with excellent CV analysis capabilities'
  },
  
  gemini: {
    name: 'gemini',
    displayName: 'Google Gemini Flash',
    model: 'gemini-1.5-flash',
    costPerToken: 0.000075, // $0.075/1M tokens
    maxTokens: 8192,
    freeTier: true, // 15 requests/minute free
    description: 'Google\'s efficient AI with generous free tier'
  },
  
  claude: {
    name: 'claude',
    displayName: 'Anthropic Claude Haiku',
    model: 'claude-3-haiku-20240307',
    costPerToken: 0.00025, // $0.25/1M tokens
    maxTokens: 4096,
    freeTier: false,
    description: 'High-quality reasoning for detailed CV feedback'
  },
  
  local: {
    name: 'local',
    displayName: 'Local AI (Ollama)',
    model: 'llama3.1:8b',
    costPerToken: 0, // Completely free
    maxTokens: 4096,
    freeTier: true,
    description: 'Private, local AI processing (future feature)'
  }
};

// Pricing tier to AI feature mapping
export const PRICING_AI_FEATURES = {
  free: {
    provider: 'gemini' as const,
    analysisType: 'basic' as const,
    monthlyLimit: 1,
    features: ['Basic CV score', 'ATS compatibility check']
  },
  
  payg: {
    provider: 'openai' as const,
    analysisType: 'detailed' as const,
    monthlyLimit: 0, // Per-analysis billing
    features: ['Detailed analysis', 'Improvement suggestions', 'Keyword optimization']
  },
  
  starter: {
    provider: 'openai' as const,
    analysisType: 'detailed' as const,
    monthlyLimit: 5,
    features: ['All detailed features', 'Industry insights', 'Basic job matching']
  },
  
  professional: {
    provider: 'openai' as const, // GPT-4 available
    analysisType: 'premium' as const,
    monthlyLimit: 150, // 150 applies per month
    features: ['All features', 'Premium AI models', 'Advanced job matching', 'Priority support']
  },
  
  career_pro: {
    provider: 'claude' as const, // Premium provider
    analysisType: 'premium' as const,
    monthlyLimit: 300, // 300 applies per month
    features: ['Executive-level analysis', 'Human review', 'Premium AI models', '1-on-1 coaching', 'Priority support']
  },
  
  elite_executive: {
    provider: 'claude' as const, // Premium provider
    analysisType: 'premium' as const,
    monthlyLimit: 450, // 450 applies per month (fair usage policy)
    features: ['Executive-level analysis', 'Human review', 'Premium AI models', '1-on-1 coaching', 'Priority support', 'White-glove service']
  }
};

// Environment variables for API keys
export const getAIConfig = () => ({
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1'
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    baseUrl: 'https://api.anthropic.com/v1'
  },
  local: {
    baseUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'
  }
});

// Default prompts for different analysis types
export const CV_ANALYSIS_PROMPTS = {
  basic: `Analyze this CV and provide a basic assessment. Return a JSON response with:
- overallScore (0-100)
- atsCompatibility (0-100)
- readabilityScore (0-100)
- 3 key strengths
- 3 main areas for improvement

CV Content: {cvText}`,

  detailed: `Perform a comprehensive CV analysis. Return a detailed JSON response with:
- Overall scores (overall, ATS compatibility, readability)
- Category scores (formatting, keywords, experience, skills, education, achievements)
- Strengths and weaknesses arrays
- Specific improvement suggestions with examples
- Missing and present keywords analysis
- Industry match assessment

CV Content: {cvText}
Job Description (if provided): {jobDescription}`,

  premium: `Conduct an executive-level CV analysis with market insights. Return a comprehensive JSON response including:
- All detailed analysis components
- Industry-specific recommendations
- Salary range estimates based on experience
- Career progression suggestions
- ATS optimization strategies
- Leadership and executive presence assessment

CV Content: {cvText}
Job Description (if provided): {jobDescription}`
}; 