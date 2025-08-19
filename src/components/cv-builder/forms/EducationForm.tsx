import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/lib/cv/types';

interface EducationFormProps {
  data: CVData['education'];
  onChange: (data: CVData['education']) => void;
}

// Helper function to format date to YYYY-MM for input type="month"
const formatDateToYYYYMM = (dateString: string): string => {
  if (!dateString) return '';
  // If it's already in YYYY-MM format, return as is
  if (/^\d{4}-\d{2}$/.test(dateString)) return dateString;
  // If it's a full date, extract YYYY-MM
  if (dateString.includes('-')) {
    return dateString.slice(0, 7);
  }
  return dateString;
};

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  // Ensure data is always an array
  const educationArray = Array.isArray(data) ? data : [];

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onChange([...educationArray, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(educationArray.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange(educationArray.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="space-y-6">
      {educationArray.map((education, index) => (
        <Card key={education.id || index} className="relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Education {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(education.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Institution Name *</Label>
                <Input
                  value={education.institution}
                  onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                  placeholder="University of Example"
                />
              </div>
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study *</Label>
                <Input
                  value={education.field}
                  onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa}
                  onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={formatDateToYYYYMM(education.startDate)}
                  onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={formatDateToYYYYMM(education.endDate)}
                  onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={addEducation}
        className="w-full border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};

export default EducationForm; 