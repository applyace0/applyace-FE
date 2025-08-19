import React from 'react';
import { cn } from '@/lib/utils';
import { type CVTemplate } from '@/data/cvTemplates';
import { getTemplateStyles } from '@/data/templateStyles';

interface TemplatePreviewProps {
  template: CVTemplate;
  className?: string;
  showContent?: boolean;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  className,
  showContent = true
}) => {
  const templateStyles = getTemplateStyles(template);

  // Apply the template's font family
  const fontStyle = {
    fontFamily: templateStyles.fontFamily
  };

  const renderLayout = () => {
    switch (template.layout) {
      case 'single-column':
        return (
          <div className="w-full h-full bg-white" style={fontStyle}>
            {/* Header with actual template color */}
            <div className={cn("h-12 flex items-center justify-center", templateStyles.header)}>
              <div className="text-white text-xs font-medium px-2">Header</div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Name */}
              <div className={cn("h-4 bg-gray-300 rounded w-3/4", templateStyles.accent)}></div>
              {/* Title */}
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              {/* Contact */}
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              
              {/* Section */}
              <div className={cn("h-3 bg-gray-400 rounded w-1/4 mt-3", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
              
              {/* Section */}
              <div className={cn("h-3 bg-gray-400 rounded w-1/4 mt-3", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        );

      case 'two-column':
        return (
          <div className="w-full h-full bg-white flex" style={fontStyle}>
            {/* Left Column */}
            <div className="w-1/3 bg-gray-50 p-2">
              <div className={cn("h-8 rounded mb-2 flex items-center justify-center", templateStyles.header)}>
                <div className="text-white text-xs font-medium">Side</div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="w-2/3 p-2 space-y-2">
              <div className={cn("h-4 bg-gray-300 rounded w-3/4", templateStyles.accent)}></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              
              <div className={cn("h-3 bg-gray-400 rounded w-1/4 mt-2", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="w-full h-full bg-white" style={fontStyle}>
            {/* Modern Header */}
            <div className={cn("h-16 relative", templateStyles.header)}>
              <div className="absolute bottom-2 left-3 right-3">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2 mt-1"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              <div className={cn("h-3 bg-gray-200 rounded w-1/4", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              
              <div className={cn("h-3 bg-gray-400 rounded w-1/4 mt-2", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className="w-full h-full bg-white" style={fontStyle}>
            {/* Classic Header */}
            <div className={cn("p-3 border-b-2", templateStyles.border)}>
              <div className={cn("h-4 bg-gray-300 rounded w-3/4", templateStyles.accent)}></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              <div className={cn("h-3 bg-gray-400 rounded w-1/4", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              
              <div className={cn("h-3 bg-gray-400 rounded w-1/4 mt-2", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="w-full h-full bg-white" style={fontStyle}>
            {/* Creative Header */}
            <div className="relative">
              <div className={cn("h-8", templateStyles.header)}></div>
              <div className="absolute -bottom-2 left-3 right-3">
                <div className="h-6 bg-white rounded shadow-sm border border-gray-200 p-1">
                  <div className={cn("h-4 bg-gray-300 rounded w-3/4", templateStyles.accent)}></div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3 pt-4 space-y-2">
              <div className={cn("h-3 bg-gray-200 rounded w-1/2", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              
              <div className={cn("h-3 bg-gray-400 rounded w-1/4 mt-2", templateStyles.accent)}></div>
              <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              <div className="h-2 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-white" style={fontStyle}>
            <div className={cn("h-12 flex items-center justify-center", templateStyles.header)}>
              <div className="text-white text-xs font-medium">Header</div>
            </div>
            <div className="p-3 space-y-2">
              <div className={cn("h-4 bg-gray-300 rounded w-3/4", templateStyles.accent)}></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full h-full rounded-lg overflow-hidden shadow-sm", className)}>
      {showContent ? (
        renderLayout()
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" style={fontStyle}>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">📄</div>
            <div className="text-sm font-medium text-gray-700">{template.name}</div>
            <div className="text-xs text-gray-500 mt-1">{template.layout}</div>
            <div className="text-xs text-gray-400 mt-1">{template.colorScheme}</div>
          </div>
        </div>
      )}
    </div>
  );
}; 