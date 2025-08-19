import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CertificationsForm from './forms/CertificationsForm';
import LanguagesForm from './forms/LanguagesForm';
import ReferencesForm from './forms/ReferencesForm';
import PageLimitSettings from './PageLimitSettings';
import type { CVData } from '@/shared/types/cv';
import { DEFAULT_CV_SETTINGS } from '@/lib/cv/pageLimit';

interface CVFormProps {
  cvData: CVData;
  onDataChange: (data: CVData) => void;
  templateId: string;
}

const CVForm: React.FC<CVFormProps> = ({ cvData, onDataChange, templateId }) => {
  const updatePersonalInfo = (personalInfo: CVData['personalInfo']) => {
    onDataChange({ ...cvData, personalInfo });
  };

  const updateExperience = (experiences: CVData['experiences']) => {
    onDataChange({ ...cvData, experiences });
  };

  const updateEducation = (education: CVData['education']) => {
    onDataChange({ ...cvData, education });
  };

  const updateSkills = (skills: CVData['skills']) => {
    onDataChange({ ...cvData, skills });
  };

  const updateCertifications = (certifications: CVData['certifications']) => {
    onDataChange({ ...cvData, certifications });
  };

  const updateLanguages = (languages: CVData['languages']) => {
    onDataChange({ ...cvData, languages });
  };

  const updateReferences = (references: CVData['references']) => {
    onDataChange({ ...cvData, references });
  };

  const updateSettings = (settings: CVData['settings']) => {
    onDataChange({ ...cvData, settings });
  };

  return (
    <div className="flex flex-col h-full justify-center items-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalInfoForm
              data={cvData.personalInfo}
              onChange={updatePersonalInfo}
            />
          </CardContent>
        </Card>

        {/* Page Limit Settings - Moved to top */}
        <PageLimitSettings
          settings={cvData.settings || DEFAULT_CV_SETTINGS}
          onSettingsChange={updateSettings}
          templateId={templateId}
          cvData={cvData}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Work Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExperienceForm
              data={cvData.experiences}
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
              data={cvData.education}
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
              data={cvData.skills}
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
              data={cvData.certifications}
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
              data={cvData.languages}
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
              data={cvData.references}
              onChange={updateReferences}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CVForm; 