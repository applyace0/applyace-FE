import { supabase } from './supabase';

export interface ATSResults {
  score: number;
  grammarSuggestions: string[];
  keywordMatch: number;
  missingKeywords: string[];
  overallFeedback: string;
  readabilityScore: number;
  formattingScore: number;
  actionVerbScore: number;
  quantifiableAchievements: number;
}

export interface GrammarError {
  message: string;
  offset: number;
  length: number;
  replacements: string[];
  rule: {
    id: string;
    description: string;
  };
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  matchPercentage: number;
  suggestedKeywords: string[];
}

// Common job keywords by industry
const INDUSTRY_KEYWORDS = {
  'software-development': [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker', 'Kubernetes',
    'Agile', 'Scrum', 'CI/CD', 'REST API', 'Microservices', 'TypeScript', 'Vue.js', 'Angular'
  ],
  'data-science': [
    'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas',
    'NumPy', 'Scikit-learn', 'Data Visualization', 'Statistics', 'Big Data', 'Hadoop', 'Spark'
  ],
  'marketing': [
    'Digital Marketing', 'SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Email Marketing',
    'Social Media Marketing', 'Analytics', 'Google Analytics', 'CRM', 'HubSpot', 'Marketing Automation'
  ],
  'sales': [
    'Sales Management', 'CRM', 'Salesforce', 'Lead Generation', 'Account Management', 'Pipeline Management',
    'Negotiation', 'Client Relations', 'Revenue Growth', 'B2B Sales', 'Cold Calling', 'Sales Strategy'
  ],
  'finance': [
    'Financial Analysis', 'Excel', 'Financial Modeling', 'Valuation', 'Accounting', 'QuickBooks',
    'Budgeting', 'Forecasting', 'Risk Management', 'Compliance', 'Audit', 'Tax Preparation'
  ],
  'general': [
    'Project Management', 'Leadership', 'Communication', 'Problem Solving', 'Team Management',
    'Strategic Planning', 'Customer Service', 'Microsoft Office', 'Time Management', 'Organization'
  ]
};

// Action verbs for CV enhancement
const ACTION_VERBS = [
  'Developed', 'Implemented', 'Managed', 'Led', 'Created', 'Designed', 'Built', 'Launched',
  'Improved', 'Increased', 'Reduced', 'Optimized', 'Streamlined', 'Coordinated', 'Facilitated',
  'Analyzed', 'Researched', 'Evaluated', 'Planned', 'Executed', 'Delivered', 'Achieved', 'Exceeded'
];

// Grammar and style rules
const GRAMMAR_RULES = [
  {
    id: 'action-verbs',
    description: 'Use action verbs to start bullet points',
    check: (text: string) => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const actionVerbCount = sentences.filter(sentence => 
        ACTION_VERBS.some(verb => 
          sentence.trim().toLowerCase().startsWith(verb.toLowerCase())
        )
      ).length;
      return {
        score: (actionVerbCount / sentences.length) * 100,
        suggestions: actionVerbCount < sentences.length * 0.7 ? 
          ['Start bullet points with action verbs like "Developed", "Implemented", "Led"'] : []
      };
    }
  },
  {
    id: 'quantifiable-achievements',
    description: 'Include quantifiable achievements',
    check: (text: string) => {
      const numberPattern = /\d+%|\d+x|\$\d+|\d+% increase|\d+% decrease|\d+ customers|\d+ projects/gi;
      const matches = text.match(numberPattern) || [];
      return {
        score: Math.min(matches.length * 20, 100),
        suggestions: matches.length < 3 ? 
          ['Include specific numbers and percentages to quantify your achievements'] : []
      };
    }
  },
  {
    id: 'consistent-tense',
    description: 'Use consistent verb tense',
    check: (text: string) => {
      const presentTense = /\b(am|is|are|do|does|have|has)\b/gi;
      const pastTense = /\b(was|were|did|had|developed|implemented|managed|led)\b/gi;
      const presentCount = (text.match(presentTense) || []).length;
      const pastCount = (text.match(pastTense) || []).length;
      const total = presentCount + pastCount;
      const consistency = total > 0 ? Math.abs(presentCount - pastCount) / total : 1;
      return {
        score: (1 - consistency) * 100,
        suggestions: consistency > 0.3 ? 
          ['Use consistent verb tense throughout your CV'] : []
      };
    }
  }
];

/**
 * Analyze CV text for ATS optimization
 */
export async function analyzeATS(cvText: string, jobKeywords?: string[], industry?: string): Promise<ATSResults> {
  try {
    // Get industry-specific keywords
    const industryKeywords = industry ? INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS] || [] : [];
    const allKeywords = [...(jobKeywords || []), ...industryKeywords, ...INDUSTRY_KEYWORDS.general];
    
    // Remove duplicates and normalize
    const uniqueKeywords = [...new Set(allKeywords.map(k => k.toLowerCase()))];
    
    // Analyze keyword match
    const keywordAnalysis = analyzeKeywords(cvText, uniqueKeywords);
    
    // Analyze grammar and style
    const grammarAnalysis = analyzeGrammar(cvText);
    
    // Calculate readability score
    const readabilityScore = calculateReadability(cvText);
    
    // Calculate formatting score
    const formattingScore = analyzeFormatting(cvText);
    
    // Calculate action verb score
    const actionVerbAnalysis = GRAMMAR_RULES.find(rule => rule.id === 'action-verbs')?.check(cvText) || { score: 0, suggestions: [] };
    
    // Calculate quantifiable achievements score
    const quantifiableAnalysis = GRAMMAR_RULES.find(rule => rule.id === 'quantifiable-achievements')?.check(cvText) || { score: 0, suggestions: [] };
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (keywordAnalysis.matchPercentage * 0.3) +
      (grammarAnalysis.score * 0.2) +
      (readabilityScore * 0.15) +
      (formattingScore * 0.15) +
      (actionVerbAnalysis.score * 0.1) +
      (quantifiableAnalysis.score * 0.1)
    );
    
    // Generate overall feedback
    const feedback = generateFeedback({
      keywordMatch: keywordAnalysis.matchPercentage,
      grammarScore: grammarAnalysis.score,
      readabilityScore,
      formattingScore,
      actionVerbScore: actionVerbAnalysis.score,
      quantifiableScore: quantifiableAnalysis.score
    });
    
    return {
      score: overallScore,
      grammarSuggestions: [
        ...grammarAnalysis.suggestions,
        ...actionVerbAnalysis.suggestions,
        ...quantifiableAnalysis.suggestions
      ],
      keywordMatch: keywordAnalysis.matchPercentage,
      missingKeywords: keywordAnalysis.missing,
      overallFeedback: feedback,
      readabilityScore,
      formattingScore,
      actionVerbScore: actionVerbAnalysis.score,
      quantifiableAchievements: quantifiableAnalysis.score
    };
    
  } catch (error) {
    console.error('ATS analysis error:', error);
    throw new Error('Failed to analyze CV for ATS optimization');
  }
}

/**
 * Analyze keyword matching
 */
function analyzeKeywords(cvText: string, keywords: string[]): KeywordAnalysis {
  const cvLower = cvText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  
  keywords.forEach(keyword => {
    if (cvLower.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const matchPercentage = keywords.length > 0 ? (matched.length / keywords.length) * 100 : 0;
  
  return {
    matched,
    missing: missing.slice(0, 10), // Limit to top 10 missing keywords
    matchPercentage: Math.round(matchPercentage),
    suggestedKeywords: missing.slice(0, 5) // Suggest top 5 missing keywords
  };
}

/**
 * Analyze grammar and style
 */
function analyzeGrammar(cvText: string): { score: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let totalScore = 0;
  
  GRAMMAR_RULES.forEach(rule => {
    const result = rule.check(cvText);
    totalScore += result.score;
    suggestions.push(...result.suggestions);
  });
  
  return {
    score: Math.round(totalScore / GRAMMAR_RULES.length),
    suggestions: suggestions.slice(0, 5) // Limit to top 5 suggestions
  };
}

/**
 * Calculate readability score using Flesch Reading Ease
 */
function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = countSyllables(text);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch Reading Ease formula
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  
  // Convert to 0-100 scale and ensure it's within bounds
  return Math.max(0, Math.min(100, Math.round(fleschScore)));
}

/**
 * Count syllables in text (simplified)
 */
function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let syllableCount = 0;
  
  words.forEach(word => {
    // Simple syllable counting (not perfect but good enough for CV analysis)
    const vowels = word.match(/[aeiouy]+/g) || [];
    syllableCount += vowels.length;
    
    // Adjust for common patterns
    if (word.endsWith('e') && word.length > 3) syllableCount--;
    if (word.endsWith('ed') && word.length > 4) syllableCount--;
  });
  
  return Math.max(syllableCount, words.length); // At least one syllable per word
}

/**
 * Analyze formatting
 */
function analyzeFormatting(cvText: string): number {
  let score = 100;
  const suggestions: string[] = [];
  
  // Check for proper section headers
  const sectionHeaders = cvText.match(/^[A-Z][A-Z\s]+$/gm) || [];
  if (sectionHeaders.length < 3) {
    score -= 20;
    suggestions.push('Use clear section headers (e.g., "EXPERIENCE", "EDUCATION")');
  }
  
  // Check for bullet points
  const bulletPoints = cvText.match(/^[\s]*[•\-\*][\s]*/gm) || [];
  if (bulletPoints.length < 5) {
    score -= 15;
    suggestions.push('Use bullet points to organize information');
  }
  
  // Check for consistent spacing
  const doubleSpaces = cvText.match(/\s{2,}/g) || [];
  if (doubleSpaces.length > 10) {
    score -= 10;
    suggestions.push('Use consistent spacing throughout');
  }
  
  // Check for proper capitalization
  const sentences = cvText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const improperlyCapitalized = sentences.filter(s => 
    s.trim().length > 0 && !s.trim()[0].match(/[A-Z]/)
  ).length;
  
  if (improperlyCapitalized > sentences.length * 0.1) {
    score -= 15;
    suggestions.push('Ensure proper capitalization at the start of sentences');
  }
  
  return Math.max(0, score);
}

/**
 * Generate overall feedback based on scores
 */
function generateFeedback(scores: {
  keywordMatch: number;
  grammarScore: number;
  readabilityScore: number;
  formattingScore: number;
  actionVerbScore: number;
  quantifiableScore: number;
}): string {
  const feedbacks: string[] = [];
  
  if (scores.keywordMatch < 60) {
    feedbacks.push('Your CV could benefit from more industry-specific keywords to improve ATS matching.');
  }
  
  if (scores.grammarScore < 70) {
    feedbacks.push('Consider improving grammar and style for better readability.');
  }
  
  if (scores.readabilityScore < 60) {
    feedbacks.push('Your CV may be too complex. Consider simplifying language for better readability.');
  }
  
  if (scores.formattingScore < 70) {
    feedbacks.push('Improve formatting with clear sections, bullet points, and consistent spacing.');
  }
  
  if (scores.actionVerbScore < 70) {
    feedbacks.push('Start bullet points with action verbs to make your achievements more impactful.');
  }
  
  if (scores.quantifiableScore < 50) {
    feedbacks.push('Include specific numbers and percentages to quantify your achievements.');
  }
  
  if (feedbacks.length === 0) {
    return 'Excellent! Your CV is well-optimized for ATS systems with good keyword matching, grammar, and formatting.';
  }
  
  return feedbacks.join(' ');
}

/**
 * Get suggested keywords for a specific job title or industry
 */
export function getSuggestedKeywords(jobTitle: string, industry?: string): string[] {
  const titleLower = jobTitle.toLowerCase();
  const suggestions: string[] = [];
  
  // Add industry-specific keywords
  if (industry && INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS]) {
    suggestions.push(...INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS]);
  }
  
  // Add job-specific keywords based on title
  if (titleLower.includes('developer') || titleLower.includes('engineer')) {
    suggestions.push('Software Development', 'Programming', 'Code Review', 'Debugging', 'Testing');
  }
  
  if (titleLower.includes('manager') || titleLower.includes('lead')) {
    suggestions.push('Team Leadership', 'Project Management', 'Strategic Planning', 'Mentoring');
  }
  
  if (titleLower.includes('analyst')) {
    suggestions.push('Data Analysis', 'Reporting', 'Research', 'Problem Solving', 'Critical Thinking');
  }
  
  if (titleLower.includes('designer')) {
    suggestions.push('UI/UX Design', 'Creative Design', 'Adobe Creative Suite', 'Prototyping');
  }
  
  // Add general professional keywords
  suggestions.push(...INDUSTRY_KEYWORDS.general);
  
  return [...new Set(suggestions)]; // Remove duplicates
}

/**
 * Save ATS analysis results to database
 */
export async function saveATSAnalysis(cvId: string, results: ATSResults): Promise<void> {
  try {
    const { error } = await supabase
      .from('cv_ats_analysis')
      .upsert({
        cv_id: cvId,
        score: results.score,
        grammar_suggestions: results.grammarSuggestions,
        keyword_match: results.keywordMatch,
        missing_keywords: results.missingKeywords,
        overall_feedback: results.overallFeedback,
        readability_score: results.readabilityScore,
        formatting_score: results.formattingScore,
        action_verb_score: results.actionVerbScore,
        quantifiable_achievements: results.quantifiableAchievements,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving ATS analysis:', error);
    // Don't throw error - ATS analysis is not critical for CV functionality
  }
}

/**
 * Get cached ATS analysis results
 */
export async function getCachedATSAnalysis(cvId: string): Promise<ATSResults | null> {
  try {
    const { data, error } = await supabase
      .from('cv_ats_analysis')
      .select('*')
      .eq('cv_id', cvId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      score: data.score,
      grammarSuggestions: data.grammar_suggestions || [],
      keywordMatch: data.keyword_match,
      missingKeywords: data.missing_keywords || [],
      overallFeedback: data.overall_feedback,
      readabilityScore: data.readability_score,
      formattingScore: data.formatting_score,
      actionVerbScore: data.action_verb_score,
      quantifiableAchievements: data.quantifiable_achievements
    };
  } catch (error) {
    console.error('Error getting cached ATS analysis:', error);
    return null;
  }
} 