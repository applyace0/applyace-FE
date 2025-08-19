export interface ParsedCVData {
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
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    url?: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: string[];
  references: Array<{
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }>;
}

export class CVParser {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  parse(): ParsedCVData {
    const lines = this.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return {
      full_name: this.extractName(lines),
      job_title: this.extractJobTitle(lines),
      email: this.extractEmail(),
      phone: this.extractPhone(),
      location: this.extractLocation(lines),
      linkedin_url: this.extractLinkedIn(),
      portfolio_url: this.extractPortfolio(),
      summary: this.extractSummary(lines),
      experiences: this.extractExperiences(lines),
      education: this.extractEducation(lines),
      skills: this.extractSkills(lines),
      projects: this.extractProjects(lines),
      languages: this.extractLanguages(lines),
      certifications: this.extractCertifications(lines),
      references: this.extractReferences(lines)
    };
  }

  private extractName(lines: string[]): string {
    // Look for name patterns in the first few lines
    const namePatterns = [
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)$/,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    ];

    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1].length > 3 && match[1].length < 50) {
          return match[1].trim();
        }
      }
    }

    return 'Your Name';
  }

  private extractJobTitle(lines: string[]): string {
    const jobTitlePatterns = [
      /(?:Senior|Junior|Lead|Principal|Staff|Associate)?\s*(?:Software Engineer|Developer|Programmer|Designer|Manager|Consultant|Analyst|Specialist|Coordinator|Director|VP|CEO|CTO|CFO)/i,
      /(?:Software|Web|Mobile|Full Stack|Frontend|Backend|DevOps|Data|Machine Learning|AI|UI\/UX|Product|Project|Business|Marketing|Sales|HR|Finance|Operations|Legal|Medical|Nursing|Teaching|Research)\s+(?:Engineer|Developer|Designer|Manager|Consultant|Analyst|Specialist|Coordinator|Director|VP|Officer|Practitioner|Professional|Teacher|Professor|Researcher)/i
    ];

    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      for (const pattern of jobTitlePatterns) {
        const match = line.match(pattern);
        if (match) {
          return match[0].trim();
        }
      }
    }

    return '';
  }

  private extractEmail(): string {
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
    const match = this.text.match(emailPattern);
    return match ? match[0] : '';
  }

  private extractPhone(): string {
    const phonePatterns = [
      /[\+]?[1-9]?[\d]{1,14}/,
      /[\+]?[1-9]?[\d]{1,3}[-.\s]?[\d]{1,3}[-.\s]?[\d]{1,4}/,
      /[\+]?[1-9]?[\d]{1,3}[-.\s]?[\d]{1,4}[-.\s]?[\d]{1,4}[-.\s]?[\d]{1,4}/
    ];

    for (const pattern of phonePatterns) {
      const match = this.text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return '';
  }

  private extractLocation(lines: string[]): string {
    const locationPatterns = [
      /(?:Location|Address|City):\s*([^\n\r]+)/i,
      /([A-Za-z\s]+,\s*[A-Z]{2})/,
      /([A-Za-z\s]+,\s*[A-Za-z\s]+)/,
      /([A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5})/
    ];

    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      for (const pattern of locationPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }

    return '';
  }

  private extractLinkedIn(): string {
    const linkedinPattern = /(?:linkedin\.com|linkedin)/i;
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = this.text.match(urlPattern) || [];
    
    for (const url of urls) {
      if (linkedinPattern.test(url)) {
        return url.trim();
      }
    }

    return '';
  }

  private extractPortfolio(): string {
    const portfolioPatterns = [
      /(?:portfolio|website|site):\s*(https?:\/\/[^\s]+)/i,
      /(?:github\.com|github)/i,
      /(?:behance\.net|behance)/i,
      /(?:dribbble\.com|dribbble)/i
    ];

    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = this.text.match(urlPattern) || [];
    
    for (const url of urls) {
      for (const pattern of portfolioPatterns) {
        if (pattern.test(url)) {
          return url.trim();
        }
      }
    }

    return '';
  }

  private extractSummary(lines: string[]): string {
    const summaryPatterns = [
      /(?:Summary|Profile|Objective|About):\s*([^\n\r]+(?:\n[^\n\r]+)*)/i,
      /(?:Professional Summary|Career Summary|Personal Summary):\s*([^\n\r]+(?:\n[^\n\r]+)*)/i
    ];

    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i];
      for (const pattern of summaryPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }

    // Fallback: take first substantial paragraph
    let summary = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > 50 && !this.isSectionHeader(line)) {
        summary = line;
        break;
      }
    }

    return summary || 'Experienced professional with a strong track record of success.';
  }

  private extractExperiences(lines: string[]): Array<{company: string; role: string; duration: string; description: string}> {
    const experiences: Array<{company: string; role: string; duration: string; description: string}> = [];
    const experienceSection = this.findSection(lines, ['Experience', 'Work Experience', 'Employment', 'Professional Experience', 'Career History']);
    
    if (!experienceSection) return experiences;

    const experienceBlocks = this.splitIntoBlocks(experienceSection);
    
    for (const block of experienceBlocks) {
      const experience = this.parseExperienceBlock(block);
      if (experience.company && experience.role) {
        experiences.push(experience);
      }
    }

    return experiences;
  }

  private extractEducation(lines: string[]): Array<{institution: string; degree: string; year: string; gpa?: string}> {
    const education: Array<{institution: string; degree: string; year: string; gpa?: string}> = [];
    const educationSection = this.findSection(lines, ['Education', 'Academic Background', 'Qualifications']);
    
    if (!educationSection) return education;

    const educationBlocks = this.splitIntoBlocks(educationSection);
    
    for (const block of educationBlocks) {
      const edu = this.parseEducationBlock(block);
      if (edu.institution && edu.degree) {
        education.push(edu);
      }
    }

    return education;
  }

  private extractSkills(lines: string[]): string[] {
    const skillsSection = this.findSection(lines, ['Skills', 'Technical Skills', 'Competencies', 'Expertise', 'Technologies']);
    
    if (!skillsSection) {
      // Fallback: look for common skills throughout the text
      const commonSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
        'TypeScript', 'Angular', 'Vue.js', 'PHP', 'C#', 'C++', 'Ruby', 'Go',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Git', 'Agile',
        'Scrum', 'REST API', 'GraphQL', 'MongoDB', 'PostgreSQL', 'MySQL',
        'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD'
      ];
      
      const foundSkills = commonSkills.filter(skill => 
        this.text.toLowerCase().includes(skill.toLowerCase())
      );
      
      return foundSkills;
    }

    const skillsText = skillsSection.join(' ');
    const skills = skillsText
      .split(/[,;•]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 50)
      .slice(0, 20); // Limit to 20 skills

    return skills;
  }

  private extractProjects(lines: string[]): Array<{name: string; description: string; technologies: string; url?: string}> {
    const projects: Array<{name: string; description: string; technologies: string; url?: string}> = [];
    const projectsSection = this.findSection(lines, ['Projects', 'Portfolio', 'Key Projects', 'Selected Projects']);
    
    if (!projectsSection) return projects;

    const projectBlocks = this.splitIntoBlocks(projectsSection);
    
    for (const block of projectBlocks) {
      const project = this.parseProjectBlock(block);
      if (project.name && project.description) {
        projects.push(project);
      }
    }

    return projects;
  }

  private extractLanguages(lines: string[]): Array<{language: string; proficiency: string}> {
    const languages: Array<{language: string; proficiency: string}> = [];
    const languagesSection = this.findSection(lines, ['Languages', 'Language Skills', 'Foreign Languages']);
    
    if (!languagesSection) return languages;

    const languagePattern = /([A-Za-z]+)\s*[-:]\s*(Native|Fluent|Advanced|Intermediate|Basic|Beginner)/i;
    
    for (const line of languagesSection) {
      const match = line.match(languagePattern);
      if (match) {
        languages.push({
          language: match[1].trim(),
          proficiency: match[2].trim()
        });
      }
    }

    return languages;
  }

  private extractCertifications(lines: string[]): string[] {
    const certifications: string[] = [];
    const certSection = this.findSection(lines, ['Certifications', 'Certificates', 'Professional Certifications']);
    
    if (!certSection) return certifications;

    const certPattern = /([A-Za-z\s]+(?:Certified|Certificate|Certification|License))/i;
    
    for (const line of certSection) {
      const match = line.match(certPattern);
      if (match) {
        certifications.push(match[1].trim());
      }
    }

    return certifications;
  }

  private extractReferences(lines: string[]): Array<{name: string; title: string; company: string; email: string; phone: string}> {
    const references: Array<{name: string; title: string; company: string; email: string; phone: string}> = [];
    const refSection = this.findSection(lines, ['References', 'Professional References']);
    
    if (!refSection) return references;

    const refBlocks = this.splitIntoBlocks(refSection);
    
    for (const block of refBlocks) {
      const ref = this.parseReferenceBlock(block);
      if (ref.name && ref.title) {
        references.push(ref);
      }
    }

    return references;
  }

  // Helper methods
  private findSection(lines: string[], sectionNames: string[]): string[] | null {
    let startIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (sectionNames.some(name => line.includes(name.toLowerCase()))) {
        startIndex = i + 1;
        break;
      }
    }
    
    if (startIndex === -1) return null;
    
    const sectionLines: string[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (this.isSectionHeader(line)) break;
      sectionLines.push(line);
    }
    
    return sectionLines;
  }

  private isSectionHeader(line: string): boolean {
    const headerPatterns = [
      /^[A-Z][A-Z\s]+$/,
      /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/,
      /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:$/
    ];
    
    return headerPatterns.some(pattern => pattern.test(line.trim()));
  }

  private splitIntoBlocks(lines: string[]): string[][] {
    const blocks: string[][] = [];
    let currentBlock: string[] = [];
    
    for (const line of lines) {
      if (line.trim().length === 0) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
          currentBlock = [];
        }
      } else {
        currentBlock.push(line);
      }
    }
    
    if (currentBlock.length > 0) {
      blocks.push(currentBlock);
    }
    
    return blocks;
  }

  private parseExperienceBlock(block: string[]): {company: string; role: string; duration: string; description: string} {
    const company = block[0] || '';
    const role = block[1] || '';
    const duration = block[2] || '';
    const description = block.slice(3).join(' ') || '';
    
    return { company, role, duration, description };
  }

  private parseEducationBlock(block: string[]): {institution: string; degree: string; year: string; gpa?: string} {
    const institution = block[0] || '';
    const degree = block[1] || '';
    const year = block[2] || '';
    const gpa = block[3] || '';
    
    return { institution, degree, year, gpa };
  }

  private parseProjectBlock(block: string[]): {name: string; description: string; technologies: string; url?: string} {
    const name = block[0] || '';
    const description = block[1] || '';
    const technologies = block[2] || '';
    const url = block[3] || '';
    
    return { name, description, technologies, url };
  }

  private parseReferenceBlock(block: string[]): {name: string; title: string; company: string; email: string; phone: string} {
    const name = block[0] || '';
    const title = block[1] || '';
    const company = block[2] || '';
    const email = block[3] || '';
    const phone = block[4] || '';
    
    return { name, title, company, email, phone };
  }
}

// Utility function to parse CV text
export function parseCVText(text: string): ParsedCVData {
  const parser = new CVParser(text);
  return parser.parse();
}

// Utility function to convert parsed data to CV builder format
export function convertToCVBuilderFormat(parsedData: ParsedCVData) {
  return {
    full_name: parsedData.full_name,
    job_title: parsedData.job_title || '',
    email: parsedData.email,
    phone: parsedData.phone,
    location: parsedData.location,
    linkedin_url: parsedData.linkedin_url || '',
    portfolio_url: parsedData.portfolio_url || '',
    summary: parsedData.summary,
    experiences: parsedData.experiences,
    education: parsedData.education,
    skills: parsedData.skills.join(', '),
    projects: parsedData.projects,
    languages: parsedData.languages,
    certifications: parsedData.certifications.join(', '),
    references: parsedData.references
  };
} 