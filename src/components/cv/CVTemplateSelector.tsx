import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cvTemplates, type CVTemplate } from '@/data/cvTemplates';
import { TemplatePreview } from './TemplatePreview';

interface CVTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  userTier?: string;
  showAllTemplates?: boolean;
}

const TIER_TABS = [
  { id: 'all', name: 'All' },
  { id: 'free', name: 'Free' },
  { id: 'starter', name: 'Starter' },
  { id: 'professional', name: 'Professional' },
  { id: 'career-pro', name: 'Career Pro' },
  { id: 'elite', name: 'Elite Executive' },
];

const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({
  onSelectTemplate,
  userTier = 'free',
  showAllTemplates = false,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Filter templates by selected tier
  let filteredTemplates = cvTemplates.filter(t => t.tier === selectedTier);
  if (selectedTier === 'all') {
    filteredTemplates = cvTemplates;
  }

  // Get color scheme for badges based on template colors
  const getColorScheme = (colorScheme: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
      'blue': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      'emerald': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
      'amber': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
      'slate': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      'gray': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
      'teal': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
      'indigo': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    };
    return colorMap[colorScheme] || colorMap['blue'];
  };

  // Get layout icon and color
  const getLayoutInfo = (layout: string) => {
    const layoutMap: { [key: string]: { icon: string; color: string; label: string } } = {
      'single-column': { icon: '📄', color: 'bg-slate-500', label: 'Single Column' },
      'two-column': { icon: '📋', color: 'bg-blue-500', label: 'Two Column' },
      'right-side': { icon: '📊', color: 'bg-emerald-500', label: 'Right Side' },
      'center-title': { icon: '🎯', color: 'bg-purple-500', label: 'Center Title' },
      'minimal-borders': { icon: '✨', color: 'bg-amber-500', label: 'Minimal' },
    };
    return layoutMap[layout] || layoutMap['single-column'];
  };

  // Get header alignment info
  const getHeaderAlignInfo = (align: string) => {
    const alignMap: { [key: string]: { icon: string; color: string; label: string } } = {
      'left': { icon: '⬅️', color: 'bg-gray-500', label: 'Left' },
      'center': { icon: '🎯', color: 'bg-blue-500', label: 'Center' },
      'right': { icon: '➡️', color: 'bg-emerald-500', label: 'Right' },
    };
    return alignMap[align] || alignMap['left'];
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Tier Filter Tabs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your CV Template</h2>
        <div className="flex flex-wrap gap-2">
          {TIER_TABS.map((tier) => (
            <Button
              key={tier.id}
              variant={selectedTier === tier.id ? "default" : "outline"}
              onClick={() => setSelectedTier(tier.id)}
              className={`
                transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
                ${selectedTier === tier.id
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                  : 'hover:bg-blue-50 hover:border-blue-300'
                }
                font-medium px-4 py-2 rounded-lg
              `}
            >
              {tier.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const colorScheme = getColorScheme(template.colorScheme);
          const layoutInfo = getLayoutInfo(template.layout);
          const headerAlignInfo = getHeaderAlignInfo(template.headerAlign);

          return (
            <Card
              key={template.id}
              className={`
                group cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105
                hover:shadow-2xl hover:shadow-blue-500/20 border-2 hover:border-blue-300
                relative overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300
                hover:before:opacity-100
              `}
              onClick={() => onSelectTemplate(template.id)}
            >
              {/* Blue glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {template.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={`
                      ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}
                      transition-all duration-300 hover:scale-110
                    `}
                  >
                    {template.tier.charAt(0).toUpperCase() + template.tier.slice(1)}
                  </Badge>
                </div>

                {/* Template Preview */}
                <div className="w-full h-32 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mb-3 group-hover:border-blue-300 transition-colors duration-300">
                  <TemplatePreview template={template} />
                </div>

                {/* Style Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Header Color Badge */}
                  <Badge
                    variant="outline"
                    className={`
                      ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}
                      transition-all duration-300 hover:scale-105
                      flex items-center gap-1 text-xs
                    `}
                  >
                    🎨 {template.colorScheme.charAt(0).toUpperCase() + template.colorScheme.slice(1)} Header
                  </Badge>

                  {/* Layout Badge */}
                  <Badge
                    variant="outline"
                    className={`
                      bg-gray-100 text-gray-700 border-gray-300
                      transition-all duration-300 hover:scale-105
                      flex items-center gap-1 text-xs
                    `}
                  >
                    {layoutInfo.icon} {layoutInfo.label}
                  </Badge>

                  {/* Header Alignment Badge */}
                  <Badge
                    variant="outline"
                    className={`
                      bg-gray-100 text-gray-700 border-gray-300
                      transition-all duration-300 hover:scale-105
                      flex items-center gap-1 text-xs
                    `}
                  >
                    {headerAlignInfo.icon} {headerAlignInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{template.features.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* ATS Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">ATS Score:</span>
                    <Badge
                      variant="outline"
                      className={`
                        ${template.atsScore >= 98 ? 'bg-green-100 text-green-800 border-green-300' :
                          template.atsScore >= 95 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          template.atsScore >= 93 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-gray-100 text-gray-800 border-gray-300'}
                        transition-all duration-300 hover:scale-105
                      `}
                    >
                      {template.atsScore}%
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No templates available for the selected tier.</p>
        </div>
      )}
    </div>
  );
};

export default CVTemplateSelector; 