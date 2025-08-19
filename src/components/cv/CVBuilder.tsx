import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cvOperations, CVData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface CVBuilderProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const CVBuilder: React.FC<CVBuilderProps> = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experiences: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }],
    skills: '',
    certifications: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    if (!user) {
      toast.error('Please sign in to create a CV');
      navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index] = { ...newExperiences[index], [field]: value };
    setFormData(prev => ({ ...prev, experiences: newExperiences }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { company: '', role: '', duration: '', description: '' }]
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to create a CV');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const cvData = {
        title: formData.full_name + "'s CV",
        content: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          summary: formData.summary,
          experiences: formData.experiences,
          education: formData.education,
          skills: formData.skills,
          certifications: formData.certifications
        },
        is_public: false
      };

      const { data, error } = await supabase
        .from('cvs')
        .insert([cvData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('CV created successfully!');
      handleSuccess();
    } catch (error: any) {
      console.error('Error creating CV:', error);
      toast.error(error.message || 'Failed to create CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="summary"
              placeholder="Write a brief summary of your professional background..."
              value={formData.summary}
              onChange={handleInputChange}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  required
                />
                <Input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  required
                />
                <Input
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  required
                />
              </div>
            ))}
            <Button type="button" onClick={addExperience} variant="outline">
              Add Experience
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  required
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  required
                />
                <Input
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  required
                />
                <Input
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                />
              </div>
            ))}
            <Button type="button" onClick={addEducation} variant="outline">
              Add Education
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              name="skills"
              placeholder="List your skills (e.g., JavaScript, React, Project Management)"
              value={formData.skills}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="certifications"
              placeholder="List your certifications and achievements"
              value={formData.certifications}
              onChange={handleInputChange}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating CV...' : 'Create CV'}
        </Button>
      </form>
    </div>
  );
};
