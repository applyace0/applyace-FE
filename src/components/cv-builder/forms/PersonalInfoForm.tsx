import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CVData } from '@/lib/cv/types';

interface PersonalInfoFormProps {
  data: CVData['personalInfo'];
  onChange: (data: CVData['personalInfo']) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof CVData['personalInfo'], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
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
          placeholder="City, State"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input
          id="linkedin"
          value={data.linkedin}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website/Portfolio</Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => handleChange('website', e.target.value)}
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