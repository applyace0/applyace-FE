import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const addExperience = () => {
    onChange([...data, {
      company: '',
      role: '',
      duration: '',
      description: ''
    }]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = data.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updatedExperiences);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {data.map((experience, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium">Experience {index + 1}</h4>
            {data.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="space-y-2">
              <Label htmlFor={`company-${index}`}>Company Name</Label>
              <Input
                id={`company-${index}`}
                placeholder="Company Name"
                value={experience.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`role-${index}`}>Job Title</Label>
              <Input
                id={`role-${index}`}
                placeholder="Job Title"
                value={experience.role}
                onChange={(e) => updateExperience(index, 'role', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`duration-${index}`}>Duration</Label>
              <Input
                id={`duration-${index}`}
                placeholder="e.g., Jan 2020 - Present"
                value={experience.duration}
                onChange={(e) => updateExperience(index, 'duration', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Textarea
              id={`description-${index}`}
              placeholder="Describe your role, responsibilities, and achievements..."
              value={experience.description}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={3}
            />
          </div>
        </Card>
      ))}
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
