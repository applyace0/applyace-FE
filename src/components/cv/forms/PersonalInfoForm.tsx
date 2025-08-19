import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Linkedin, Globe } from 'lucide-react';

interface PersonalInfoFormProps {
  data: {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    portfolio_url?: string;
    summary: string;
  };
  onChange: (data: {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    portfolio_url?: string;
    summary: string;
  }) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof typeof data, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          value={data.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          placeholder="John Doe"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="job_title">Job Title</Label>
        <Input
          id="job_title"
          value={data.job_title || ''}
          onChange={(e) => handleChange('job_title', e.target.value)}
          placeholder="Software Engineer"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@email.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="New York, NY"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="linkedin_url" className="flex items-center gap-1">
          <Linkedin className="h-4 w-4" />
          LinkedIn Profile
        </Label>
        <Input
          id="linkedin_url"
          value={data.linkedin_url || ''}
          onChange={(e) => handleChange('linkedin_url', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="portfolio_url" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          Website/Portfolio
        </Label>
        <Input
          id="portfolio_url"
          value={data.portfolio_url || ''}
          onChange={(e) => handleChange('portfolio_url', e.target.value)}
          placeholder="www.johndoe.com"
        />
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Brief summary of your professional background and key strengths..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
