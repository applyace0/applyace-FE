import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { CVData, CVExperience } from '@/shared/types/cv';

interface ExperienceFormProps {
  data: CVData['experiences'];
  onChange: (data: CVData['experiences']) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  // Ensure data is always an array
  const experienceArray = Array.isArray(data) ? data : [];

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange([...experienceArray, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(experienceArray.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    onChange(experienceArray.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Format date to YYYY-MM
  const formatDateToYYYYMM = (date: string) => {
    if (!date) return '';
    return date.slice(0, 7); // Take only YYYY-MM part
  };

  return (
    <div className="space-y-6">
      {experienceArray.map((experience, index) => (
        <Card key={experience.id || index} className="relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Experience {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(experience.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                  placeholder="Company Inc."
                />
              </div>
              <div className="space-y-2">
                <Label>Job Title *</Label>
                <Input
                  value={experience.position}
                  onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="month"
                  value={formatDateToYYYYMM(experience.startDate)}
                  onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={formatDateToYYYYMM(experience.endDate)}
                  onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                  disabled={experience.current}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onCheckedChange={(checked) => updateExperience(experience.id, 'current', checked as boolean)}
                />
                <Label htmlFor={`current-${experience.id}`}>Currently working here</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                placeholder="• Achieved X by doing Y measured by Z&#10;• Led a team of X people to accomplish Y&#10;• Implemented X which resulted in Y% improvement"
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={addExperience}
        className="w-full border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};

export default ExperienceForm; 