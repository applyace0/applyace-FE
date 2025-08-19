import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { CVData, CVSkill, CVProject } from '@/shared/types/cv';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';
import LanguagesForm from './forms/LanguagesForm';
import ReferencesForm from './forms/ReferencesForm';
import { normalizeCVData } from '@/lib/cv/normalize';

interface CVFormProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
}

const CVForm: React.FC<CVFormProps> = ({ cvData, onDataChange }) => {
  const updatePersonalInfo = (personalInfo: {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    portfolio_url?: string;
    summary: string;
  }) => {
    onDataChange(
      normalizeCVData({
        ...cvData,
        personalInfo: {
          fullName: personalInfo.full_name,
          title: personalInfo.job_title,
          email: personalInfo.email,
          phone: personalInfo.phone,
          location: personalInfo.location,
          linkedin: personalInfo.linkedin_url,
          website: personalInfo.portfolio_url,
          summary: personalInfo.summary,
        },
      })
    );
  };

  const updateExperience = (experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>) => {
    onDataChange(normalizeCVData({ ...cvData, experience }));
  };

  const updateEducation = (education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>) => {
    onDataChange(normalizeCVData({ ...cvData, education }));
  };

  const updateSkills = (skills: string[]) => {
    onDataChange(normalizeCVData({ 
      ...cvData, 
      skills: skills.map(skill => ({ id: `skill${Date.now()}`, name: skill }))
    }));
  };

  const updateCertifications = (certifications: string) => {
    onDataChange(
      normalizeCVData({
        ...cvData,
        certifications: certifications
          .split('\n')
          .map((c: string) => c.trim())
          .filter(Boolean)
          .map(cert => ({ id: `cert${Date.now()}`, name: cert })),
      })
    );
  };

  const updateLanguages = (languages: Array<{
    id: string;
    language: string;
    proficiency: string;
    certification_name?: string;
  }>) => {
    onDataChange(normalizeCVData({ 
      ...cvData, 
      languages: languages.map(lang => ({
        id: lang.id,
        language: lang.language,
        proficiency: lang.proficiency,
        certification_name: lang.certification_name
      }))
    }));
  };

  const updateReferences = (references: Array<{
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship?: string;
  }>) => {
    onDataChange(normalizeCVData({ 
      ...cvData, 
      references: references.map(ref => ({
        id: ref.id,
        name: ref.name,
        title: ref.title,
        company: ref.company,
        email: ref.email,
        phone: ref.phone,
        relationship: ref.relationship
      }))
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm
            data={{
              full_name: cvData.personalInfo.fullName,
              email: cvData.personalInfo.email || '',
              phone: cvData.personalInfo.phone || '',
              location: cvData.personalInfo.location || '',
              linkedin_url: cvData.personalInfo.linkedin,
              portfolio_url: cvData.personalInfo.website,
              summary: cvData.personalInfo.summary || '',
            }}
            onChange={updatePersonalInfo}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Work Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceForm
            data={(cvData.experiences || []).map(exp => ({
              company: exp.company,
              role: exp.position || exp.role || '',
              duration: '', // Could be derived from startDate/endDate if needed
              description: exp.description || ''
            }))}
            onChange={updateExperience}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Education</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EducationForm
            data={cvData.education.map(edu => ({
              institution: edu.institution,
              degree: edu.degree,
              year: edu.startDate || edu.endDate || '',
              gpa: edu.gpa || ''
            }))}
            onChange={updateEducation}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkillsForm
            data={Array.isArray(cvData.skills) ? cvData.skills.map(skill => skill.name) : []}
            onChange={updateSkills}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <span>Certifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CertificationsForm
            data={Array.isArray(cvData.certifications) ? cvData.certifications.map(cert => cert.name).join('\n') : ''}
            onChange={updateCertifications}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
            <span>Languages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LanguagesForm
            data={Array.isArray(cvData.languages) ? cvData.languages.map(lang => ({
              id: lang.id || `lang${Date.now()}`,
              language: lang.language || lang.name || '',
              proficiency: lang.proficiency || lang.level || '',
              certification_name: lang.certification_name || ''
            })) : []}
            onChange={updateLanguages}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</span>
            <span>References</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReferencesForm
            data={Array.isArray(cvData.references) ? cvData.references.map(ref => ({
              id: ref.id || `ref${Date.now()}`,
              name: ref.name,
              title: ref.title || '',
              company: ref.company || '',
              email: ref.email || '',
              phone: ref.phone || '',
              relationship: ''
            })) : []}
            onChange={updateReferences}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CVForm;
