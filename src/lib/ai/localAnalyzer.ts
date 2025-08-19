import { CVAnalysisRequest, CVAnalysisResponse, CVSuggestion } from './types';

export class LocalCVAnalyzer {
  // ATS Keywords by Industry (Comprehensive Database)
  private atsKeywords = {
    technology: [
      // Programming Languages
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      'HTML', 'CSS', 'SQL', 'NoSQL', 'R', 'MATLAB', 'Scala', 'Perl', 'Shell', 'Bash',
      
      // Frameworks & Libraries
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails',
      '.NET', 'ASP.NET', 'jQuery', 'Bootstrap', 'Tailwind', 'Material-UI', 'Redux', 'Vuex', 'Next.js', 'Nuxt.js',
      
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server', 'SQLite', 'Cassandra',
      'DynamoDB', 'Firebase', 'Supabase', 'Neo4j', 'InfluxDB',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'GitHub Actions', 'CircleCI',
      'Terraform', 'Ansible', 'Chef', 'Puppet', 'Nginx', 'Apache', 'Linux', 'Unix', 'Ubuntu', 'CentOS',
      
      // Tools & Technologies
      'Git', 'SVN', 'Jira', 'Confluence', 'Slack', 'VS Code', 'IntelliJ', 'Eclipse', 'Postman', 'Swagger',
      'REST API', 'GraphQL', 'gRPC', 'Microservices', 'WebSockets', 'JSON', 'XML', 'YAML',
      
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'SOLID', 'Clean Code', 'Code Review',
      'Unit Testing', 'Integration Testing', 'Test Automation', 'Performance Testing',
      
      // Emerging Tech
      'Machine Learning', 'Artificial Intelligence', 'Deep Learning', 'Neural Networks', 'Computer Vision',
      'Natural Language Processing', 'Blockchain', 'IoT', 'AR/VR', 'Cybersecurity', 'Penetration Testing',
      'Ethical Hacking', 'OWASP', 'Security Audit'
    ],
    
    business: [
      // Management & Leadership
      'Project Management', 'Team Leadership', 'Strategic Planning', 'Business Strategy', 'Change Management',
      'Stakeholder Management', 'Executive Leadership', 'Cross-functional Teams', 'Remote Team Management',
      'Performance Management', 'Talent Development', 'Succession Planning', 'Coaching', 'Mentoring',
      
      // Business Analysis
      'Business Analysis', 'Requirements Gathering', 'Process Improvement', 'Workflow Optimization',
      'Business Process Mapping', 'Gap Analysis', 'Risk Assessment', 'Cost-Benefit Analysis',
      'ROI Analysis', 'KPI Development', 'Metrics & Analytics', 'Data-driven Decisions',
      
      // Sales & Marketing
      'Sales Management', 'Business Development', 'Lead Generation', 'Client Acquisition', 'Account Management',
      'Customer Relationship Management', 'CRM', 'Salesforce', 'HubSpot', 'Marketing Strategy',
      'Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'SEO', 'SEM', 'PPC',
      'Email Marketing', 'Marketing Automation', 'Brand Management', 'Customer Experience',
      
      // Operations & Finance
      'Operations Management', 'Supply Chain Management', 'Inventory Management', 'Vendor Management',
      'Contract Negotiation', 'Budget Management', 'Financial Planning', 'Forecasting', 'P&L Management',
      'Cost Control', 'Financial Reporting', 'Procurement', 'Compliance Management',
      
      // Consulting & Strategy
      'Management Consulting', 'Strategy Consulting', 'Business Transformation', 'Digital Transformation',
      'Organizational Development', 'Market Research', 'Competitive Analysis', 'Due Diligence',
      'Merger & Acquisition', 'IPO', 'Fundraising', 'Investor Relations'
    ],
    
    healthcare: [
      // Clinical Skills
      'Patient Care', 'Clinical Assessment', 'Medical History', 'Physical Examination', 'Diagnosis',
      'Treatment Planning', 'Medication Management', 'Pain Management', 'Wound Care', 'IV Therapy',
      'Vital Signs', 'Patient Monitoring', 'Emergency Care', 'Critical Care', 'ICU', 'OR',
      
      // Healthcare Technology
      'Electronic Health Records', 'EHR', 'EMR', 'EPIC', 'Cerner', 'Medical Coding', 'ICD-10', 'CPT',
      'Medical Billing', 'Healthcare Analytics', 'Telemedicine', 'Medical Devices', 'Diagnostic Equipment',
      
      // Specializations
      'Nursing', 'Registered Nurse', 'LPN', 'Nurse Practitioner', 'Physician Assistant', 'Medical Assistant',
      'Pharmacy', 'Physical Therapy', 'Occupational Therapy', 'Respiratory Therapy', 'Radiology',
      'Laboratory', 'Surgery', 'Anesthesia', 'Cardiology', 'Oncology', 'Pediatrics', 'Geriatrics',
      
      // Compliance & Quality
      'HIPAA', 'Patient Privacy', 'Healthcare Compliance', 'Joint Commission', 'Quality Assurance',
      'Patient Safety', 'Risk Management', 'Infection Control', 'Medicare', 'Medicaid', 'Insurance',
      'Clinical Research', 'FDA Regulations', 'Clinical Trials'
    ],
    
    finance: [
      // Financial Analysis
      'Financial Analysis', 'Financial Modeling', 'Valuation', 'DCF', 'LBO', 'Comparable Analysis',
      'Ratio Analysis', 'Variance Analysis', 'Trend Analysis', 'Sensitivity Analysis', 'Scenario Planning',
      
      // Accounting
      'Accounting', 'GAAP', 'IFRS', 'Financial Reporting', 'P&L', 'Balance Sheet', 'Cash Flow',
      'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Tax Preparation', 'Audit',
      'Internal Audit', 'External Audit', 'SOX Compliance', 'Month-end Close', 'Year-end Close',
      
      // Investment & Banking
      'Investment Banking', 'Corporate Finance', 'M&A', 'Capital Markets', 'Equity Research',
      'Fixed Income', 'Derivatives', 'Portfolio Management', 'Asset Management', 'Wealth Management',
      'Private Equity', 'Venture Capital', 'Hedge Funds', 'Trading', 'Risk Management',
      
      // Tools & Software
      'Excel', 'Advanced Excel', 'VBA', 'Bloomberg', 'Reuters', 'SQL', 'Python', 'R', 'Tableau',
      'Power BI', 'QuickBooks', 'SAP', 'Oracle Financials', 'Hyperion', 'Essbase',
      
      // Risk & Compliance
      'Credit Risk', 'Market Risk', 'Operational Risk', 'Regulatory Compliance', 'Basel III',
      'Dodd-Frank', 'Anti-Money Laundering', 'AML', 'KYC', 'Credit Analysis', 'Loan Underwriting',
      'Insurance', 'Actuarial', 'Quantitative Analysis'
    ],
    
    general: [
      // Soft Skills
      'Communication', 'Written Communication', 'Verbal Communication', 'Public Speaking', 'Presentation',
      'Leadership', 'Team Leadership', 'Cross-functional Leadership', 'Problem Solving', 'Critical Thinking',
      'Analytical Thinking', 'Creative Thinking', 'Decision Making', 'Time Management', 'Organization',
      'Attention to Detail', 'Multitasking', 'Adaptability', 'Flexibility', 'Resilience',
      
      // Interpersonal Skills
      'Teamwork', 'Collaboration', 'Interpersonal Skills', 'Customer Service', 'Client Relations',
      'Stakeholder Engagement', 'Negotiation', 'Conflict Resolution', 'Emotional Intelligence',
      'Cultural Awareness', 'Diversity & Inclusion', 'Mentoring', 'Training', 'Coaching',
      
      // Project & Process Skills
      'Project Coordination', 'Project Planning', 'Resource Management', 'Quality Control',
      'Process Documentation', 'Standard Operating Procedures', 'Continuous Improvement',
      'Six Sigma', 'Lean Manufacturing', 'Kaizen', 'Change Management'
    ]
  };

  // Add keyword synonyms and variations for better matching
  private keywordSynonyms: { [key: string]: string[] } = {
    'JavaScript': ['js', 'javascript', 'ecmascript'],
    'TypeScript': ['ts', 'typescript'],
    'Python': ['python', 'py'],
    'React': ['react.js', 'reactjs'],
    'Node.js': ['nodejs', 'node'],
    'Vue.js': ['vue', 'vuejs'],
    'Angular': ['angularjs', 'angular.js'],
    'PostgreSQL': ['postgres', 'postgresql'],
    'MongoDB': ['mongo', 'mongodb'],
    'REST API': ['rest', 'restful', 'api', 'rest api', 'restful api'],
    'Machine Learning': ['ml', 'machine learning', 'artificial intelligence', 'ai'],
    'Project Management': ['pm', 'project management', 'project manager'],
    'Business Analysis': ['ba', 'business analyst', 'business analysis'],
    'Customer Relationship Management': ['crm'],
    'Electronic Health Records': ['ehr', 'emr', 'electronic medical records'],
    'Financial Analysis': ['financial analyst', 'financial analysis'],
    'Excel': ['microsoft excel', 'ms excel', 'spreadsheet'],
    'Communication': ['communications', 'communicating'],
    'Leadership': ['leader', 'leading', 'lead'],
    'Problem Solving': ['problem-solving', 'troubleshooting'],
    'Time Management': ['time-management', 'scheduling']
  };

  constructor() {
    // LocalCVAnalyzer initialized
  }

  // ATS-Critical Formatting Checks
  private checkATSFormatting(cvText: string): number {
    let score = 100;
    const issues: string[] = [];

    // Check for proper section headers
    const requiredSections = ['experience', 'education', 'skills'];
    const sectionHeaders = cvText.toLowerCase();
    
    requiredSections.forEach(section => {
      if (!sectionHeaders.includes(section) && !sectionHeaders.includes(section.replace('e', ''))) {
        score -= 15;
        issues.push(`Missing ${section} section`);
      }
    });

    // Check contact information
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    
    if (!emailRegex.test(cvText)) {
      score -= 10;
      issues.push('Missing email address');
    }
    
    if (!phoneRegex.test(cvText)) {
      score -= 10;
      issues.push('Missing phone number');
    }

    // Check for dates in experience
    const dateRegex = /\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/gi;
    const dateMatches = cvText.match(dateRegex);
    if (!dateMatches || dateMatches.length < 2) {
      score -= 10;
      issues.push('Missing or insufficient date information');
    }

    // Check for bullet points or structured content
    const bulletRegex = /[\u2022\u00b7\u25aa\u25ab\u2023\u2043]|\*|\-\s|^\d+\./gm;
    const bulletMatches = cvText.match(bulletRegex);
    if (!bulletMatches || bulletMatches.length < 3) {
      score -= 10;
      issues.push('Missing or insufficient bullet points or structured content');
    }

    return score;
  }

  // ... (rest of the file continues)
} 