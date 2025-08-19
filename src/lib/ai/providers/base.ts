import { AIProvider, CVAnalysisRequest, CVAnalysisResponse, AIError } from '../types';

export abstract class BaseAIProvider {
  protected provider: AIProvider;
  protected apiKey?: string;
  protected baseUrl?: string;
  protected model: string;

  constructor(provider: AIProvider, config: { apiKey?: string; baseUrl?: string; model: string }) {
    this.provider = provider;
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.model = config.model;
  }

  abstract analyzeCV(request: CVAnalysisRequest): Promise<CVAnalysisResponse>;
  
  protected abstract makeRequest(prompt: string, maxTokens?: number): Promise<string>;
  
  protected handleError(error: any, context: string): AIError {
    console.error(`AI Provider Error (${this.provider}):`, error);
    
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      provider: this.provider,
      retryable: this.isRetryableError(error),
      timestamp: new Date().toISOString()
    };
  }
  
  protected isRetryableError(error: any): boolean {
    // Common retryable error patterns
    const retryableCodes = ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR', '429', '503', '502'];
    const errorCode = error.code || error.status?.toString() || '';
    
    return retryableCodes.some(code => errorCode.includes(code));
  }
  
  protected calculateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
  
  protected generateAnalysisId(): string {
    return crypto.randomUUID();
  }
  
  protected parseAIResponse(response: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create structured response from text
      return this.createFallbackResponse(response);
    } catch (error) {
      console.warn('Failed to parse AI response, using fallback:', error);
      return this.createFallbackResponse(response);
    }
  }
  
  private createFallbackResponse(text: string): any {
    // Extract basic information from unstructured text
    const lines = text.split('\n').filter(line => line.trim());
    
    return {
      overallScore: this.extractScore(text) || 75,
      atsCompatibility: 70,
      readabilityScore: 80,
      scores: {
        formatting: 75,
        keywords: 70,
        experience: 80,
        skills: 75,
        education: 85,
        achievements: 70
      },
      strengths: this.extractListItems(text, ['strength', 'good', 'positive', 'well']),
      weaknesses: this.extractListItems(text, ['weakness', 'improve', 'lacking', 'missing']),
      suggestions: [],
      missingKeywords: [],
      presentKeywords: [],
      keywordDensity: 0.1
    };
  }
  
  private extractScore(text: string): number | null {
    const scoreMatch = text.match(/(\d+)(?:\s*\/\s*100|\s*%|\s*out\s+of\s+100)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : null;
  }
  
  private extractListItems(text: string, keywords: string[]): string[] {
    const items: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (keywords.some(keyword => trimmed.toLowerCase().includes(keyword))) {
        // Extract the actual content after bullets, numbers, etc.
        const cleaned = trimmed.replace(/^[-•*\d+.\s]+/, '').trim();
        if (cleaned.length > 10) {
          items.push(cleaned);
        }
      }
    }
    
    return items.slice(0, 5); // Limit to 5 items
  }
} 