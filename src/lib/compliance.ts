// Compliance validation service for CV and cover letter generation
// Ensures both AST (Applicant Tracking System) and humanised compliance

export interface ComplianceResult {
  isCompliant: boolean;
  astScore: number; // 0-100
  humanisedScore: number; // 0-100
  issues: ComplianceIssue[];
  suggestions: string[];
  overallScore: number; // 0-100
}

export interface ComplianceIssue {
  type: 'ast' | 'humanised' | 'critical';
  severity: 'low' | 'medium' | 'high';
  message: string;
  field?: string;
  suggestion?: string;
}

export interface ATSComplianceCheck {
  formatCompatibility: boolean;
  keywordOptimization: boolean;
  structureRequirements: boolean;
  sectionHeaders: boolean;
  bulletPoints: boolean;
  contactInfo: boolean;
  dateFormats: boolean;
}

export interface HumanisedComplianceCheck {
  authenticVoice: boolean;
  emotionalIntelligence: boolean;
  culturalSensitivity: boolean;
  personalization: boolean;
  naturalFlow: boolean;
  professionalTone: boolean;
}

export class ComplianceService {
  // ATS Systems keywords and requirements
  private static atsKeywords = {
    workday: ['experience', 'education', 'skills', 'summary', 'contact'],
    icims: ['work experience', 'education', 'skills', 'professional summary'],
    successfactors: ['experience', 'education', 'competencies', 'summary'],
    greenhouse: ['experience', 'education', 'skills', 'about'],
    bamboohr: ['experience', 'education', 'skills', 'summary']
  };

  // Standard section headers for ATS compatibility
  private static standardHeaders = [
    'experience', 'work experience', 'employment history',
    'education', 'academic background',
    'skills', 'technical skills', 'competencies',
    'summary', 'professional summary', 'objective',
    'contact', 'contact information'
  ];

  // Humanised language patterns to avoid
  private static roboticPatterns = [
    'i am writing to express',
    'i am excited to apply',
    'i believe i would be',
    'i am confident that',
    'i am passionate about',
    'i am dedicated to',
    'i am committed to',
    'i am seeking',
    'i am looking for',
    'i am interested in'
  ];

  // Natural language alternatives
  private static naturalAlternatives = {
    'i am writing to express': 'i\'m reaching out about',
    'i am excited to apply': 'i\'m thrilled to apply for',
    'i believe i would be': 'i\'d be',
    'i am confident that': 'i\'m confident',
    'i am passionate about': 'i love',
    'i am dedicated to': 'i focus on',
    'i am committed to': 'i\'m committed to',
    'i am seeking': 'i\'m looking for',
    'i am looking for': 'i want',
    'i am interested in': 'i\'m drawn to'
  };

  /**
   * Comprehensive compliance check for CV content
   */
  static async validateCV(cvContent: string, jobKeywords: string[] = []): Promise<ComplianceResult> {
    const issues: ComplianceIssue[] = [];
    const suggestions: string[] = [];

    // ATS Compliance Checks
    const atsCheck = this.checkATSCompliance(cvContent, jobKeywords);
    const astScore = this.calculateATSScore(atsCheck);

    // Humanised Compliance Checks
    const humanisedCheck = this.checkHumanisedCompliance(cvContent);
    const humanisedScore = this.calculateHumanisedScore(humanisedCheck);

    // Generate issues and suggestions
    this.generateATSIssues(atsCheck, issues, suggestions);
    this.generateHumanisedIssues(humanisedCheck, issues, suggestions);

    const overallScore = Math.round((astScore + humanisedScore) / 2);

    return {
      isCompliant: overallScore >= 85,
      astScore,
      humanisedScore,
      issues,
      suggestions,
      overallScore
    };
  }

  /**
   * Comprehensive compliance check for cover letter content
   */
  static async validateCoverLetter(coverLetter: string, jobData: any): Promise<ComplianceResult> {
    const issues: ComplianceIssue[] = [];
    const suggestions: string[] = [];

    // ATS Compliance Checks for cover letter
    const atsCheck = this.checkCoverLetterATSCompliance(coverLetter, jobData);
    const astScore = this.calculateATSScore(atsCheck);

    // Humanised Compliance Checks
    const humanisedCheck = this.checkHumanisedCompliance(coverLetter);
    const humanisedScore = this.calculateHumanisedScore(humanisedCheck);

    // Generate issues and suggestions
    this.generateATSIssues(atsCheck, issues, suggestions);
    this.generateHumanisedIssues(humanisedCheck, issues, suggestions);

    const overallScore = Math.round((astScore + humanisedScore) / 2);

    return {
      isCompliant: overallScore >= 85,
      astScore,
      humanisedScore,
      issues,
      suggestions,
      overallScore
    };
  }

  /**
   * Optimize content for compliance
   */
  static async optimizeContent(content: string, type: 'cv' | 'cover-letter', jobKeywords: string[] = []): Promise<string> {
    let optimizedContent = content;

    // Apply humanised optimizations
    optimizedContent = this.applyHumanisedOptimizations(optimizedContent);

    // Apply ATS optimizations
    optimizedContent = this.applyATSOptimizations(optimizedContent, type, jobKeywords);

    return optimizedContent;
  }

  /**
   * ATS Compliance Checks
   */
  private static checkATSCompliance(content: string, jobKeywords: string[]): ATSComplianceCheck {
    const lowerContent = content.toLowerCase();
    
    return {
      formatCompatibility: this.checkFormatCompatibility(content),
      keywordOptimization: this.checkKeywordOptimization(lowerContent, jobKeywords),
      structureRequirements: this.checkStructureRequirements(lowerContent),
      sectionHeaders: this.checkSectionHeaders(lowerContent),
      bulletPoints: this.checkBulletPoints(content),
      contactInfo: this.checkContactInfo(content),
      dateFormats: this.checkDateFormats(content)
    };
  }

  /**
   * Cover Letter ATS Compliance Checks
   */
  private static checkCoverLetterATSCompliance(content: string, jobData: any): ATSComplianceCheck {
    const lowerContent = content.toLowerCase();
    const jobKeywords = [
      jobData.title?.toLowerCase(),
      jobData.company?.toLowerCase(),
      ...(jobData.requirements || []).map((r: string) => r.toLowerCase()),
      ...(jobData.keywords || []).map((k: string) => k.toLowerCase())
    ].filter(Boolean);

    return {
      formatCompatibility: true, // Cover letters are typically text-based
      keywordOptimization: this.checkKeywordOptimization(lowerContent, jobKeywords),
      structureRequirements: this.checkCoverLetterStructure(content),
      sectionHeaders: true, // Cover letters don't need section headers
      bulletPoints: this.checkBulletPoints(content),
      contactInfo: this.checkContactInfo(content),
      dateFormats: this.checkDateFormats(content)
    };
  }

  /**
   * Humanised Compliance Checks
   */
  private static checkHumanisedCompliance(content: string): HumanisedComplianceCheck {
    const lowerContent = content.toLowerCase();
    
    return {
      authenticVoice: this.checkAuthenticVoice(content),
      emotionalIntelligence: this.checkEmotionalIntelligence(content),
      culturalSensitivity: this.checkCulturalSensitivity(content),
      personalization: this.checkPersonalization(content),
      naturalFlow: this.checkNaturalFlow(content),
      professionalTone: this.checkProfessionalTone(content)
    };
  }

  // ATS Check Methods
  private static checkFormatCompatibility(content: string): boolean {
    // Check for common formatting issues
    const hasTables = content.includes('|') || content.includes('\t');
    const hasImages = content.includes('img') || content.includes('image');
    const hasComplexFormatting = content.includes('font') || content.includes('style');
    
    return !hasTables && !hasImages && !hasComplexFormatting;
  }

  private static checkKeywordOptimization(content: string, jobKeywords: string[]): boolean {
    if (jobKeywords.length === 0) return true;
    
    const keywordMatches = jobKeywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    );
    
    const matchRate = keywordMatches.length / jobKeywords.length;
    return matchRate >= 0.6; // At least 60% keyword match
  }

  private static checkStructureRequirements(content: string): boolean {
    const hasExperience = content.includes('experience') || content.includes('work');
    const hasEducation = content.includes('education') || content.includes('degree');
    const hasSkills = content.includes('skills') || content.includes('competencies');
    
    return hasExperience && hasEducation && hasSkills;
  }

  private static checkSectionHeaders(content: string): boolean {
    const hasStandardHeaders = this.standardHeaders.some(header => 
      content.includes(header.toLowerCase())
    );
    
    return hasStandardHeaders;
  }

  private static checkBulletPoints(content: string): boolean {
    const bulletPointCount = (content.match(/[â€¢Â·â–ªâ–«â—¦â€£âƒ]/g) || []).length;
    const lineCount = content.split('\n').length;
    
    // Should have some bullet points but not too many
    return bulletPointCount > 0 && bulletPointCount <= lineCount * 0.3;
  }

  private static checkContactInfo(content: string): boolean {
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(content);
    const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(content);
    
    return hasEmail && hasPhone;
  }

  private static checkDateFormats(content: string): boolean {
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // MM/DD/YYYY
      /\b\d{1,2}-\d{1,2}-\d{4}\b/,   // MM-DD-YYYY
      /\b\d{4}-\d{1,2}-\d{1,2}\b/,   // YYYY-MM-DD
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/i // Month YYYY
    ];
    
    return datePatterns.some(pattern => pattern.test(content));
  }

  private static checkCoverLetterStructure(content: string): boolean {
    const hasGreeting = content.toLowerCase().includes('dear');
    const hasClosing = content.toLowerCase().includes('regards') || content.toLowerCase().includes('sincerely');
    const hasSignature = content.includes('\n\n') && content.split('\n\n').length >= 3;
    
    return hasGreeting && hasClosing && hasSignature;
  }

  // Humanised Check Methods
  private static checkAuthenticVoice(content: string): boolean {
    const roboticPatternCount = this.roboticPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    ).length;
    
    return roboticPatternCount <= 2; // Allow some but not too many
  }

  private static checkEmotionalIntelligence(content: string): boolean {
    const emotionalWords = ['excited', 'thrilled', 'passionate', 'committed', 'dedicated', 'proud', 'grateful'];
    const hasEmotionalContent = emotionalWords.some(word => 
      content.toLowerCase().includes(word)
    );
    
    return hasEmotionalContent;
  }

  private static checkCulturalSensitivity(content: string): boolean {
    const insensitiveTerms = ['guys', 'manpower', 'chairman', 'salesman'];
    const hasInsensitiveTerms = insensitiveTerms.some(term => 
      content.toLowerCase().includes(term)
    );
    
    return !hasInsensitiveTerms;
  }

  private static checkPersonalization(content: string): boolean {
    const personalPronouns = ['i', 'my', 'me', 'myself'];
    const hasPersonalContent = personalPronouns.some(pronoun => 
      content.toLowerCase().includes(pronoun)
    );
    
    return hasPersonalContent;
  }

  private static checkNaturalFlow(content: string): boolean {
    const sentenceLengths = content.split(/[.!?]+/).map(s => s.trim().split(' ').length);
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    
    // Natural sentences are typically 15-25 words
    return avgSentenceLength >= 10 && avgSentenceLength <= 30;
  }

  private static checkProfessionalTone(content: string): boolean {
    const informalWords = ['awesome', 'cool', 'great', 'nice', 'good'];
    const informalCount = informalWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    return informalCount <= 3; // Allow some but not too many
  }

  // Score Calculation Methods
  private static calculateATSScore(check: ATSComplianceCheck): number {
    const checks = Object.values(check);
    const passedChecks = checks.filter(Boolean).length;
    return Math.round((passedChecks / checks.length) * 100);
  }

  private static calculateHumanisedScore(check: HumanisedComplianceCheck): number {
    const checks = Object.values(check);
    const passedChecks = checks.filter(Boolean).length;
    return Math.round((passedChecks / checks.length) * 100);
  }

  // Issue Generation Methods
  private static generateATSIssues(check: ATSComplianceCheck, issues: ComplianceIssue[], suggestions: string[]) {
    if (!check.formatCompatibility) {
      issues.push({
        type: 'ast',
        severity: 'high',
        message: 'Content contains formatting that may not parse correctly in ATS systems',
        suggestion: 'Use simple text formatting without tables, images, or complex styling'
      });
      suggestions.push('Remove any tables, images, or complex formatting. Use plain text with simple formatting.');
    }

    if (!check.keywordOptimization) {
      issues.push({
        type: 'ast',
        severity: 'medium',
        message: 'Missing important job-related keywords',
        suggestion: 'Include relevant keywords from the job description'
      });
      suggestions.push('Review the job description and include relevant keywords naturally in your content.');
    }

    if (!check.structureRequirements) {
      issues.push({
        type: 'ast',
        severity: 'high',
        message: 'Missing essential sections (Experience, Education, Skills)',
        suggestion: 'Ensure all required sections are present'
      });
      suggestions.push('Make sure your CV includes Experience, Education, and Skills sections.');
    }

    if (!check.sectionHeaders) {
      issues.push({
        type: 'ast',
        severity: 'medium',
        message: 'Section headers may not be recognized by ATS systems',
        suggestion: 'Use standard section header names'
      });
      suggestions.push('Use standard section headers like "Experience", "Education", "Skills".');
    }

    if (!check.bulletPoints) {
      issues.push({
        type: 'ast',
        severity: 'low',
        message: 'Consider using bullet points for better readability',
        suggestion: 'Add bullet points to list achievements and responsibilities'
      });
      suggestions.push('Use bullet points (â€¢) to list your achievements and responsibilities.');
    }

    if (!check.contactInfo) {
      issues.push({
        type: 'ast',
        severity: 'high',
        message: 'Missing contact information',
        suggestion: 'Include email and phone number'
      });
      suggestions.push('Make sure to include your email address and phone number.');
    }

    if (!check.dateFormats) {
      issues.push({
        type: 'ast',
        severity: 'low',
        message: 'Date formats may not be recognized',
        suggestion: 'Use standard date formats (MM/YYYY or Month YYYY)'
      });
      suggestions.push('Use standard date formats like "01/2023" or "January 2023".');
    }
  }

  private static generateHumanisedIssues(check: HumanisedComplianceCheck, issues: ComplianceIssue[], suggestions: string[]) {
    if (!check.authenticVoice) {
      issues.push({
        type: 'humanised',
        severity: 'medium',
        message: 'Content sounds too robotic or generic',
        suggestion: 'Use more natural, authentic language'
      });
      suggestions.push('Replace generic phrases with more natural, authentic language.');
    }

    if (!check.emotionalIntelligence) {
      issues.push({
        type: 'humanised',
        severity: 'low',
        message: 'Content lacks emotional connection',
        suggestion: 'Add genuine enthusiasm and passion'
      });
      suggestions.push('Show genuine enthusiasm and passion for the role and company.');
    }

    if (!check.culturalSensitivity) {
      issues.push({
        type: 'humanised',
        severity: 'high',
        message: 'Content may contain culturally insensitive language',
        suggestion: 'Use inclusive, gender-neutral language'
      });
      suggestions.push('Use inclusive, gender-neutral language throughout your content.');
    }

    if (!check.personalization) {
      issues.push({
        type: 'humanised',
        severity: 'medium',
        message: 'Content lacks personal touch',
        suggestion: 'Include personal pronouns and specific examples'
      });
      suggestions.push('Use "I" statements and include specific examples from your experience.');
    }

    if (!check.naturalFlow) {
      issues.push({
        type: 'humanised',
        severity: 'low',
        message: 'Sentence structure could be more natural',
        suggestion: 'Vary sentence length and structure'
      });
      suggestions.push('Vary your sentence length and structure for more natural flow.');
    }

    if (!check.professionalTone) {
      issues.push({
        type: 'humanised',
        severity: 'medium',
        message: 'Tone may be too informal',
        suggestion: 'Maintain professional tone throughout'
      });
      suggestions.push('Maintain a professional tone while being authentic and engaging.');
    }
  }

  // Optimization Methods
  private static applyHumanisedOptimizations(content: string): string {
    let optimized = content;

    // Replace robotic patterns with natural alternatives
    this.roboticPatterns.forEach(pattern => {
      const alternative = this.naturalAlternatives[pattern as keyof typeof this.naturalAlternatives];
      if (alternative) {
        const regex = new RegExp(pattern, 'gi');
        optimized = optimized.replace(regex, alternative);
      }
    });

    return optimized;
  }

  private static applyATSOptimizations(content: string, type: 'cv' | 'cover-letter', jobKeywords: string[]): string {
    let optimized = content;

    if (type === 'cv') {
      // Ensure standard section headers
      optimized = this.ensureStandardHeaders(optimized);
      
      // Add bullet points where appropriate
      optimized = this.addBulletPoints(optimized);
    }

    // Optimize keywords if provided
    if (jobKeywords.length > 0) {
      optimized = this.optimizeKeywords(optimized, jobKeywords);
    }

    return optimized;
  }

  private static ensureStandardHeaders(content: string): string {
    // Replace non-standard headers with standard ones
    const headerMappings = {
      'work history': 'work experience',
      'employment': 'work experience',
      'academic': 'education',
      'qualifications': 'skills',
      'competencies': 'skills',
      'about': 'professional summary'
    };

    let optimized = content;
    Object.entries(headerMappings).forEach(([old, standard]) => {
      const regex = new RegExp(`\\b${old}\\b`, 'gi');
      optimized = optimized.replace(regex, standard);
    });

    return optimized;
  }

  private static addBulletPoints(content: string): string {
    // Add bullet points to experience descriptions
    const lines = content.split('\n');
    const optimizedLines = lines.map(line => {
      if (line.trim().startsWith('-') || line.trim().startsWith('â€¢')) {
        return line; // Already has bullet point
      }
      
      // Add bullet points to experience descriptions
      if (line.trim().length > 50 && !line.trim().match(/^[A-Z][a-z]+/)) {
        return `â€¢ ${line.trim()}`;
      }
      
      return line;
    });

    return optimizedLines.join('\n');
  }

  private static optimizeKeywords(content: string, keywords: string[]): string {
    let optimized = content;
    
    // Ensure keywords are naturally integrated
    keywords.forEach(keyword => {
      if (!content.toLowerCase().includes(keyword.toLowerCase())) {
        // Add keyword naturally to summary or skills section
        const summaryMatch = optimized.match(/(professional summary|summary)/i);
        if (summaryMatch) {
          const beforeSummary = optimized.substring(0, summaryMatch.index!);
          const afterSummary = optimized.substring(summaryMatch.index! + summaryMatch[0].length);
          optimized = beforeSummary + summaryMatch[0] + ` with expertise in ${keyword}.` + afterSummary;
        }
      }
    });

    return optimized;
  }
} 

