import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cvTemplates, type CVTemplate } from '@/data/cvTemplates';
import { TemplatePreview } from '@/components/cv/TemplatePreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, Filter, Check, Star, Lock } from 'lucide-react';

export const TemplateTest: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Create categories from the new template structure
  const templateCategories = [
    { id: 'all', name: 'All Templates' },
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
    { id: 'minimal', name: 'Minimal' }
  ];

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? cvTemplates 
    : cvTemplates.filter(template => template.category === selectedCategory);

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-green-100 text-green-800 border-green-200';
      case 'starter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'professional': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'careerPro': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'eliteExecutive': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'starter': return 'Starter';
      case 'professional': return 'Professional';
      case 'careerPro': return 'Career Pro';
      case 'eliteExecutive': return 'Elite Executive';
      default: return tier;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Template Test - All 20 Templates</h1>
        <p className="text-muted-foreground">
          Testing all {cvTemplates.length} unique, professional CV templates for 2025
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{cvTemplates.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {cvTemplates.filter(t => t.tier === 'free').length}
            </div>
            <div className="text-sm text-muted-foreground">Free Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {cvTemplates.filter(t => t.tier === 'starter').length}
            </div>
            <div className="text-sm text-muted-foreground">Starter Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {cvTemplates.filter(t => t.tier === 'professional').length}
            </div>
            <div className="text-sm text-muted-foreground">Professional Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {cvTemplates.filter(t => ['careerPro', 'eliteExecutive'].includes(t.tier)).length}
            </div>
            <div className="text-sm text-muted-foreground">Premium Templates</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Template Browser</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} templates in {selectedCategory === 'all' ? 'all categories' : selectedCategory}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {templateCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Template Grid/List */}
        <div className="flex-1">
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-gray-300"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                  {viewMode === 'list' ? (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-base">{template.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getTierBadgeColor(template.tier)}`}
                          >
                            {getTierDisplayName(template.tier)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{template.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-base">{template.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTierBadgeColor(template.tier)}`}
                        >
                          {getTierDisplayName(template.tier)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                      
                      {/* Template Preview */}
                      <div className="h-32 rounded mb-3 overflow-hidden">
                        <TemplatePreview template={template} showContent={true} />
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.features.slice(0, 3).map((feature, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground capitalize">
                          {template.category}
                        </span>
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Template Preview */}
        {selectedTemplate && (
          <div className="lg:w-96">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedTemplate.name}
                  <Badge 
                    variant="outline" 
                    className={getTierBadgeColor(selectedTemplate.tier)}
                  >
                    {getTierDisplayName(selectedTemplate.tier)}
                  </Badge>
                </CardTitle>
                <CardDescription>{selectedTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Template Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="capitalize">{selectedTemplate.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layout:</span>
                      <span className="capitalize">{selectedTemplate.layout}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier:</span>
                      <span>{getTierDisplayName(selectedTemplate.tier)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color Scheme:</span>
                      <span className="capitalize">{selectedTemplate.colorScheme || 'blue'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Font:</span>
                      <span>{selectedTemplate.fontFamily || 'Inter'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ATS Score:</span>
                      <span>{selectedTemplate.atsScore || 'N/A'}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Template Preview</h4>
                  <div className="h-48 rounded overflow-hidden border">
                    <TemplatePreview template={selectedTemplate} showContent={true} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setSelectedTemplate(null)}>
                    Use Template
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}; 