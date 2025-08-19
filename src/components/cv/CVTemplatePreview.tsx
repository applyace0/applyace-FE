import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CVTemplate } from '@/data/cvTemplates';

interface CVTemplatePreviewProps {
  template: CVTemplate;
  className?: string;
}

export const CVTemplatePreview: React.FC<CVTemplatePreviewProps> = ({ 
  template, 
  className = "" 
}) => {
  const getTemplatePreview = () => {
    switch (template.layout) {
      case 'modern':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-3">
              <div className="text-lg font-bold text-gray-800">John Smith</div>
              <div className="text-sm text-gray-600">Software Engineer</div>
              <div className="text-xs text-gray-500 mt-1">john.smith@email.com • +44 7911 123456</div>
            </div>
            
            {/* Summary */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Summary</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                Experienced software engineer with 5+ years in full-stack development...
              </div>
            </div>
            
            {/* Experience */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Experience</div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-gray-800">Senior Developer</div>
                  <div className="text-xs text-gray-600">TechCorp • 2022-Present</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'classic':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="border-b border-gray-300 pb-3">
              <div className="text-xl font-bold text-gray-900">JOHN SMITH</div>
              <div className="text-sm text-gray-700 mt-1">Software Engineer</div>
              <div className="text-xs text-gray-600 mt-1">Email: john.smith@email.com | Phone: +44 7911 123456</div>
            </div>
            
            {/* Sections */}
            <div className="space-y-3">
              <div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Professional Summary</div>
                <div className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Experienced software engineer with 5+ years in full-stack development...
                </div>
              </div>
              
              <div>
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Work Experience</div>
                <div className="text-xs text-gray-700 mt-1">
                  <div className="font-medium">Senior Developer, TechCorp (2022-Present)</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'creative':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800 bg-white rounded-lg px-3 py-2 inline-block">
                John Smith
              </div>
              <div className="text-sm text-gray-600 mt-2">Software Engineer</div>
              <div className="flex justify-center gap-4 text-xs text-gray-500 mt-1">
                <span>📧 john.smith@email.com</span>
                <span>📱 +44 7911 123456</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="bg-white rounded-lg p-3 space-y-2">
              <div className="text-sm font-semibold text-gray-700">About</div>
              <div className="text-xs text-gray-600">
                Experienced software engineer with 5+ years in full-stack development...
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center text-gray-500 text-sm">
              Template Preview
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          {getTemplatePreview()}
          
          {/* Template Info Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {template.isPopular && (
              <Badge className="bg-red-500 text-white text-xs">
                🔥 Popular
              </Badge>
            )}
            {template.atsScore && (
              <Badge className="bg-blue-100 text-blue-700 text-xs">
                ATS {template.atsScore}%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 