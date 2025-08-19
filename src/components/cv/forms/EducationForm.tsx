import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { CVData, CVEducation } from '@/shared/types/cv';

interface EducationFormProps {
  cvData: CVData;
  onUpdate: (data: CVData) => void;
}

export default function EducationForm({ cvData, onUpdate }: EducationFormProps) {
  const [data, setData] = useState<CVEducation[]>(cvData.education || []);

  const addEducation = () => {
    const newEducation: CVEducation = {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: null,
      details: []
    };
    const updatedData = [...data, newEducation];
    setData(updatedData);
    updateCVData(updatedData);
  };

  const removeEducation = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
    updateCVData(updatedData);
  };

  const updateEducation = (index: number, field: keyof CVEducation, value: string | string[] | null) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setData(updatedData);
    updateCVData(updatedData);
  };

  const updateCVData = (educationData: CVEducation[]) => {
    const updatedCV = { ...cvData, education: educationData };
    onUpdate(updatedCV);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Education
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((education, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`school-${index}`}>School/Institution</Label>
                <Input
                  id={`school-${index}`}
                  value={education.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  placeholder="University Name"
                />
              </div>
              <div>
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`field-${index}`}>Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  value={education.field || ''}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  placeholder="Computer Science, Engineering, etc."
                />
              </div>
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  type="month"
                  value={education.startDate || ''}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor={`endDate-${index}`}>End Date</Label>
              <Input
                id={`endDate-${index}`}
                type="month"
                value={education.endDate || ''}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`location-${index}`}>Location</Label>
              <Input
                id={`location-${index}`}
                value={education.location || ''}
                onChange={(e) => updateEducation(index, 'location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
            {data.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
