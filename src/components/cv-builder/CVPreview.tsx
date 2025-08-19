import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';
import { CVData } from '@/lib/cv/types';
import { getTemplateById } from '@/data/cvTemplates';
import { getTemplateStyles } from '@/data/templateStyles';
import { cn } from '@/lib/utils';

interface CVPreviewProps {
  cvData: CVData;
  templateId?: string;
  showWatermark?: boolean;
  minimal?: boolean; // Add minimal mode for print/live preview
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, templateId = 'modern-professional', showWatermark = false, minimal = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const template = getTemplateById(templateId);
  const templateStyles = getTemplateStyles(templateId);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.includes(' - ')) {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatYear = (yearString: string) => {
    if (!yearString) return '';
    return yearString;
  };

  // Calculate content length to determine if multi-page is needed
  const getContentLength = () => {
    let length = 0;
    length += cvData.personalInfo.summary?.length || 0;
    length += (cvData.experiences || []).reduce((acc, exp) => acc + (exp.description?.length || 0), 0);
    length += (cvData.education || []).length * 100;
    length += (cvData.skills || []).length * 20;
    length += (cvData.certifications || []).length * 80;
    return length;
  };

  const contentLength = getContentLength();
  const isMultiPage = contentLength > 2000; // Threshold for multi-page
  const totalPages = isMultiPage ? Math.ceil(contentLength / 2000) : 1;

  // Use templateStyles.header, templateStyles.accent, templateStyles.border, templateStyles.fontFamily, templateStyles.colorStyles, templateStyles.layout throughout the component for all style and className assignments.
  // Remove getTemplateStyles, getColorStyles, and related local functions.

  // Template-specific header styling
  const getHeaderStyles = () => ({
    textAlign: templateStyles.headerAlignValue === 'center' ? 'center' : 'left',
    marginBottom: '1.5rem',
    fontFamily: templateStyles.fontFamily
  });

  // Template-specific section styling
  const getSectionStyles = () => ({
    marginBottom: '1.5rem',
    fontFamily: templateStyles.fontFamily
  });

  const renderHeader = () => {
    // Check if template should have a colored header
    // Only templates with single-column layout and certain color schemes should have colored headers
    const hasColoredHeader = template.layout === 'single-column' && 
      (template.colorScheme === 'blue' || template.colorScheme === 'emerald' || 
       template.colorScheme === 'amber' || template.colorScheme === 'slate' || 
       template.colorScheme === 'purple' || template.colorScheme === 'teal' || 
       template.colorScheme === 'indigo');
    
    if (hasColoredHeader) {
      return (
        <div className={cn("mb-6", templateStyles.header)} style={templateStyles.headerThickness}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: templateStyles.fontFamily }}>
              {cvData.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-base text-white/90 mb-1">Professional Title</p>
            <p className="text-sm text-white/80">{cvData.personalInfo.email || 'email@example.com'}</p>
            {cvData.personalInfo.phone && <p className="text-sm text-white/80">{cvData.personalInfo.phone}</p>}
            {cvData.personalInfo.location && <p className="text-sm text-white/80">{cvData.personalInfo.location}</p>}
          </div>
        </div>
      );
    }
    
    // Standard header for templates without colored headers
    return (
      <div className="mb-6" style={templateStyles.headerAlign}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: templateStyles.fontFamily }}>
          {cvData.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-base text-gray-600 mb-1">Professional Title</p>
        <p className="text-sm text-gray-600">{cvData.personalInfo.email || 'email@example.com'}</p>
        {cvData.personalInfo.phone && <p className="text-sm text-gray-600">{cvData.personalInfo.phone}</p>}
        {cvData.personalInfo.location && <p className="text-sm text-gray-600">{cvData.personalInfo.location}</p>}
      </div>
    );
  };

  const renderSectionHeading = (title: string) => (
    <h2 
      className="text-lg font-semibold mb-3 text-gray-800" 
      style={{ 
        fontFamily: templateStyles.fontFamily,
        ...templateStyles.headingStyle,
        color: templateStyles.accent.replace('text-', '').includes('blue') ? '#3b82f6' :
               templateStyles.accent.replace('text-', '').includes('emerald') ? '#10b981' :
               templateStyles.accent.replace('text-', '').includes('amber') ? '#f59e0b' :
               templateStyles.accent.replace('text-', '').includes('slate') ? '#64748b' :
               templateStyles.accent.replace('text-', '').includes('purple') ? '#8b5cf6' :
               templateStyles.accent.replace('text-', '').includes('gray') ? '#6b7280' :
               templateStyles.accent.replace('text-', '').includes('teal') ? '#14b8a6' :
               templateStyles.accent.replace('text-', '').includes('indigo') ? '#6366f1' :
               '#6b7280'
      }}
    >
      {title}
    </h2>
  );

  const renderSectionDivider = () => {
    if (templateStyles.sectionDividerValue === 'horizontal') {
      return <hr className="border-gray-300 my-4" />;
    }
    return null;
  };

  const renderList = (items: string[]) => {
    if (!items || items.length === 0) return null;
    
    const listStyle = template.listStyle || 'bullet';
    
    switch (listStyle) {
      case 'bullet':
        return (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'dash':
        return (
          <ul className="list-none space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                <span className="mr-2 text-gray-500">—</span>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'arrow':
        return (
          <ul className="list-none space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                <span className="mr-2 text-blue-600">→</span>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'check':
        return (
          <ul className="list-none space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                <span className="mr-2 text-green-600">✓</span>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'circle':
        return (
          <ul className="list-none space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                <span className="mr-2 w-1 h-1 bg-gray-500 rounded-full mt-1.5"></span>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'star':
        return (
          <ul className="list-none space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700 flex items-start" style={{ fontFamily: templateStyles.fontFamily }}>
                <span className="mr-2 text-yellow-500">★</span>
                {item}
              </li>
            ))}
          </ul>
        );
      case 'minimal':
        return (
          <ul className="list-none space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                {item}
              </li>
            ))}
          </ul>
        );
      default:
        return (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
                {item}
              </li>
            ))}
          </ul>
        );
    }
  };

  const renderSummary = () => (
    cvData.personalInfo.summary && (
      <div style={getSectionStyles()}>
        {renderSectionHeading('PROFESSIONAL SUMMARY')}
        {renderSectionDivider()}
        <p className="text-gray-700 text-sm leading-relaxed">
          {cvData.personalInfo.summary}
        </p>
      </div>
    )
  );

  const renderExperience = () => (
    <div className="mb-6">
      {renderSectionHeading('Experience')}
              {(cvData.experiences || []).map((exp, index) => (
        <div key={index} className="mb-4" style={templateStyles.sectionDivider}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-medium text-gray-900" style={{ fontFamily: templateStyles.fontFamily }}>
              {exp.position || 'Job Title'}
            </h3>
            <span className="text-xs text-gray-600">
              {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 'Date Range'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            {exp.company || 'Company'} • {exp.location || 'Location'}
          </p>
          {exp.description && exp.description.includes('\n') ? (
            <div className="text-xs text-gray-700" style={{ fontFamily: templateStyles.fontFamily }}>
              {renderList(exp.description.split('\n').filter(Boolean))}
            </div>
          ) : (
            <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: templateStyles.fontFamily }}>
              {exp.description || 'Job description'}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6">
      {renderSectionHeading('Education')}
      {cvData.education.map((edu, index) => (
        <div key={index} className="mb-4" style={templateStyles.sectionDivider}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-medium text-gray-900" style={{ fontFamily: templateStyles.fontFamily }}>
              {edu.degree || 'Degree'}
            </h3>
            <span className="text-xs text-gray-600">
              {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : 'Date Range'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-1">
            {edu.institution || 'Institution'}
          </p>
          {edu.gpa && (
            <p className="text-xs text-gray-700">
              GPA: {edu.gpa}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => {
    const skills = Array.isArray(cvData.skills) ? cvData.skills : [];
    
    // Check if template should show skills as badges or list
    const showAsBadges = template.skillsDisplay === 'tags';
    
    if (showAsBadges) {
      return (
        <div className="mb-6">
          {renderSectionHeading('Skills')}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                style={{ fontFamily: templateStyles.fontFamily }}
              >
                {typeof skill === 'string' ? skill : (skill as any)?.name || String(skill)}
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    // Show as comma-separated list
    return (
      <div className="mb-6">
        {renderSectionHeading('Skills')}
        <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: templateStyles.fontFamily }}>
          {skills.join(', ')}
        </p>
      </div>
    );
  };

  const renderCertifications = () => (
    cvData.certifications.length > 0 && (
      <div style={getSectionStyles()}>
        {renderSectionHeading('CERTIFICATIONS')}
        {renderSectionDivider()}
        <div className="space-y-3">
          {cvData.certifications.map((cert, index) => (
            <div key={index} style={{ borderLeft: '3px solid #6b7280', paddingLeft: '1rem' }}>
              <h3 className="font-semibold text-gray-900 text-sm">{cert.name || 'Certification Name'}</h3>
              <p className="text-gray-600 text-sm">{cert.issuer || 'Issuing Organization'}</p>
              {cert.date && <p className="text-gray-500 text-xs">{cert.date}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderPageContent = (pageNum: number) => {
    // Handle different layout types
    const layout = template.layout || 'single-column';
    
    if (layout === 'right-side' || layout === 'two-column') {
      // Two-column layout
      return (
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            {renderHeader()}
            {renderSummary()}
            {renderSkills()}
            {renderCertifications()}
          </div>
          <div className="col-span-1">
            {renderExperience()}
            {renderEducation()}
          </div>
        </div>
      );
    }
    
    // Single-column layout (default)
    if (pageNum === 1) {
      return (
        <div>
          {renderHeader()}
          {renderSummary()}
          {renderExperience()}
          {renderEducation()}
          {renderSkills()}
          {renderCertifications()}
        </div>
      );
    }
    
    // For multi-page, distribute content across pages
    return (
      <div>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Page {pageNum}</h3>
        </div>
        {pageNum === 2 && (
          <>
            {renderExperience()}
            {renderEducation()}
          </>
        )}
        {pageNum === 3 && (
          <>
            {renderSkills()}
            {renderCertifications()}
          </>
        )}
      </div>
    );
  };

  // Only render the CV content (no Card, CardHeader, CardContent, badges, or ATS info) if minimal is true
  if (minimal) {
    return (
      <div className="cv-preview" style={{ ...templateStyles, position: 'relative', minHeight: '1100px' }}>
        <div className="p-10">
          {renderPageContent(currentPage)}
          {showWatermark && (
            <div className="text-xs text-gray-400 text-right mt-8 mb-2 pr-4 print:text-gray-300 print:italic" style={{ position: 'absolute', bottom: 0, right: 0, width: '100%' }}>
              Created by ApplyAce
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="sticky top-4" data-testid="cv-preview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <div className="flex items-center gap-2">
            {template && (
              <Badge variant="outline" className="text-xs">
                {template.name}
              </Badge>
            )}
            {isMultiPage && (
              <Badge variant="secondary" className="text-xs">
                {totalPages} Page{totalPages > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg shadow-sm max-w-md mx-auto">
          {/* CV Content */}
          <div className="p-6 min-h-[800px]">
            {renderPageContent(currentPage)}
          </div>

          {/* Multi-page Navigation */}
          {isMultiPage && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Template Info */}
          {template && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-gray-600">{template.category} • {template.layout}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">ATS Score</p>
                  <p className="font-medium">{template.atsScore || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CVPreview; 