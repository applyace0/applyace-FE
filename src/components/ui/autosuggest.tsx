import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutosuggestProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxItems?: number;
  className?: string;
  disabled?: boolean;
  fieldType?: 'skills' | 'jobTitles' | 'companies' | 'degrees' | 'institutions' | 'languages' | 'technologies' | 'certifications';
}

// Enhanced suggestions by category
const FIELD_SUGGESTIONS = {
  skills: {
    programming: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting', 'Assembly'
    ],
    frameworks: [
      'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
      'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI', 'Next.js', 'Nuxt.js', 'Svelte'
    ],
    databases: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
      'Cassandra', 'DynamoDB', 'Firebase', 'Supabase', 'CouchDB'
    ],
    tools: [
      'Git', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'AWS', 'Azure', 'GCP',
      'Jira', 'Confluence', 'Slack', 'Figma', 'Adobe Creative Suite', 'Tableau', 'Power BI'
    ],
    methodologies: [
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'Lean', 'Six Sigma',
      'Waterfall', 'SAFe', 'XP', 'Crystal'
    ]
  },
  jobTitles: {
    software: [
      'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer', 'Frontend Developer',
      'Backend Developer', 'DevOps Engineer', 'Software Architect', 'Tech Lead', 'Engineering Manager',
      'Principal Engineer', 'Staff Engineer', 'Software Developer', 'Web Developer', 'Mobile Developer'
    ],
    data: [
      'Data Scientist', 'Data Analyst', 'Data Engineer', 'Machine Learning Engineer', 'AI Engineer',
      'Business Intelligence Analyst', 'Data Architect', 'Analytics Manager', 'Research Scientist'
    ],
    product: [
      'Product Manager', 'Product Owner', 'Product Analyst', 'Product Marketing Manager',
      'Technical Product Manager', 'Senior Product Manager', 'Director of Product', 'VP of Product'
    ],
    design: [
      'UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer', 'Visual Designer',
      'Interaction Designer', 'Design Systems Designer', 'Creative Director', 'Art Director'
    ],
    management: [
      'Project Manager', 'Program Manager', 'Scrum Master', 'Agile Coach', 'Delivery Manager',
      'Technical Manager', 'Engineering Director', 'CTO', 'VP of Engineering'
    ]
  },
  companies: {
    tech: [
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb', 'Twitter',
      'LinkedIn', 'Salesforce', 'Adobe', 'Oracle', 'IBM', 'Intel', 'Cisco', 'NVIDIA', 'AMD'
    ],
    startups: [
      'Stripe', 'Shopify', 'Square', 'Zoom', 'Slack', 'Notion', 'Figma', 'Canva', 'Airtable',
      'Linear', 'Vercel', 'Netlify', 'GitHub', 'GitLab', 'Atlassian', 'Miro', 'Loom'
    ],
    consulting: [
      'McKinsey & Company', 'Bain & Company', 'Boston Consulting Group', 'Deloitte', 'PwC',
      'EY', 'KPMG', 'Accenture', 'Capgemini', 'Infosys', 'TCS', 'Wipro', 'Cognizant'
    ],
    finance: [
      'Goldman Sachs', 'JPMorgan Chase', 'Morgan Stanley', 'Bank of America', 'Citigroup',
      'Wells Fargo', 'BlackRock', 'Vanguard', 'Fidelity', 'Charles Schwab', 'American Express'
    ]
  },
  degrees: {
    computerScience: [
      'Bachelor of Science in Computer Science', 'Master of Science in Computer Science',
      'PhD in Computer Science', 'Bachelor of Engineering in Computer Engineering',
      'Master of Engineering in Software Engineering', 'Bachelor of Technology in IT'
    ],
    business: [
      'Bachelor of Business Administration', 'Master of Business Administration',
      'Bachelor of Commerce', 'Master of Finance', 'Bachelor of Economics',
      'Master of Economics', 'PhD in Business Administration'
    ],
    engineering: [
      'Bachelor of Engineering', 'Master of Engineering', 'Bachelor of Technology',
      'Master of Technology', 'PhD in Engineering', 'Bachelor of Science in Engineering'
    ],
    arts: [
      'Bachelor of Arts', 'Master of Arts', 'Bachelor of Fine Arts', 'Master of Fine Arts',
      'Bachelor of Design', 'Master of Design', 'PhD in Arts'
    ]
  },
  institutions: {
    universities: [
      'Harvard University', 'Stanford University', 'MIT', 'University of California, Berkeley',
      'University of Oxford', 'University of Cambridge', 'Imperial College London',
      'University College London', 'ETH Zurich', 'University of Toronto', 'University of British Columbia'
    ],
    colleges: [
      'California Institute of Technology', 'Carnegie Mellon University', 'Georgia Institute of Technology',
      'University of Illinois at Urbana-Champaign', 'University of Michigan', 'University of Washington',
      'Cornell University', 'Princeton University', 'Yale University', 'Columbia University'
    ]
  },
  languages: [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese (Mandarin)',
    'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
  ],
  technologies: [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go',
    'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Docker', 'Kubernetes', 'AWS',
    'Azure', 'GCP', 'Firebase', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API'
  ],
  certifications: [
    'AWS Certified Solutions Architect', 'AWS Certified Developer', 'AWS Certified DevOps Engineer',
    'Microsoft Certified: Azure Developer', 'Microsoft Certified: Azure Solutions Architect',
    'Google Cloud Professional Developer', 'Google Cloud Professional Cloud Architect',
    'Certified Scrum Master (CSM)', 'Professional Scrum Master (PSM)', 'PMP', 'PRINCE2',
    'ITIL Foundation', 'CISSP', 'CompTIA A+', 'CompTIA Network+', 'CompTIA Security+'
  ]
};

const Autosuggest: React.FC<AutosuggestProps> = ({
  value = [],
  onChange,
  placeholder = "Type to add items...",
  suggestions = [],
  maxItems = 30,
  className = "",
  disabled = false,
  fieldType = 'skills'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get suggestions based on field type
  const getFieldSuggestions = (): string[] => {
    if (fieldType === 'jobTitles') {
      return Object.values(FIELD_SUGGESTIONS.jobTitles).flat();
    } else if (fieldType === 'companies') {
      return Object.values(FIELD_SUGGESTIONS.companies).flat();
    } else if (fieldType === 'degrees') {
      return Object.values(FIELD_SUGGESTIONS.degrees).flat();
    } else if (fieldType === 'institutions') {
      return Object.values(FIELD_SUGGESTIONS.institutions).flat();
    } else if (fieldType === 'languages') {
      return Object.values(FIELD_SUGGESTIONS.languages).flat();
    } else if (fieldType === 'technologies') {
      return Object.values(FIELD_SUGGESTIONS.technologies).flat();
    } else if (fieldType === 'certifications') {
      return Object.values(FIELD_SUGGESTIONS.certifications).flat();
    } else {
      return Object.values(FIELD_SUGGESTIONS.skills).flat();
    }
  };

  // Memoize suggestions to prevent infinite re-renders
  const allSuggestions = React.useMemo(() => getFieldSuggestions(), [fieldType]);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(suggestion)
      );
      setFilteredSuggestions(filtered.slice(0, 10));
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, value, allSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = (item: string) => {
    if (value.length >= maxItems) return;
    
    const trimmedItem = item.trim();
    if (trimmedItem && !value.includes(trimmedItem)) {
      onChange([...value, trimmedItem]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    onChange(value.filter(item => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddItem(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveItem(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddItem(suggestion);
  };

  return (
    <div className={cn("relative", className)} ref={suggestionsRef}>
      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md bg-background min-h-[40px]">
        {value.map((item, index) => (
          <Badge
            key={`item-${index}-${item.substring(0, 10)}`}
            variant="secondary"
            className="flex items-center gap-1 text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemoveItem(item)}
              className="ml-1 hover:text-destructive"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={disabled || value.length >= maxItems}
        />
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={`suggestion-${index}-${suggestion.substring(0, 10)}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            >
              {suggestion}
            </button>
          ))}
          
          {filteredSuggestions.length === 0 && inputValue.trim() && (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              Press Enter to add "{inputValue}"
            </div>
          )}
        </div>
      )}

      {value.length >= maxItems && (
        <p className="text-sm text-muted-foreground mt-1">
          Maximum {maxItems} items reached
        </p>
      )}
    </div>
  );
};

export default Autosuggest; 