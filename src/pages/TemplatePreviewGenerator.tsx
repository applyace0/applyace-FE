import React, { useState, useEffect } from 'react';
import { cvTemplates } from '@/data/cvTemplates';
import { CVData } from '@/lib/cv/types';
import { getSampleDataForTemplate } from '@/data/sampleCVData';
import CVPreview from '@/components/cv-builder/CVPreview';

const TemplatePreviewGenerator: React.FC = () => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentTemplateIndex < cvTemplates.length) {
      const template = cvTemplates[currentTemplateIndex];
      const sampleData = getSampleDataForTemplate(template.id);
      setCvData(sampleData);
      setIsLoading(false);
    }
  }, [currentTemplateIndex]);

  const handleNextTemplate = () => {
    if (currentTemplateIndex < cvTemplates.length - 1) {
      setCurrentTemplateIndex(prev => prev + 1);
      setIsLoading(true);
    }
  };

  const handlePreviousTemplate = () => {
    if (currentTemplateIndex > 0) {
      setCurrentTemplateIndex(prev => prev - 1);
      setIsLoading(true);
    }
  };

  const handleJumpToTemplate = (index: number) => {
    setCurrentTemplateIndex(index);
    setIsLoading(true);
  };

  const currentTemplate = cvTemplates[currentTemplateIndex];

  if (!cvData || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Template Preview Generator
        </h1>
        <p className="text-gray-600">
          Backend tool for generating template preview images. Template {currentTemplateIndex + 1} of {cvTemplates.length}
        </p>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousTemplate}
              disabled={currentTemplateIndex === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <span className="text-sm text-gray-600">
              {currentTemplateIndex + 1} / {cvTemplates.length}
            </span>
            
            <button
              onClick={handleNextTemplate}
              disabled={currentTemplateIndex === cvTemplates.length - 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Jump to:</span>
            <select
              value={currentTemplateIndex}
              onChange={(e) => handleJumpToTemplate(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              {cvTemplates.map((template, index) => (
                <option key={template.id} value={index}>
                  {template.name} ({template.tier})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentTemplate.name}
              </h2>
              <p className="text-gray-600 mb-4">{currentTemplate.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Tier:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {currentTemplate.tier}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">ATS Score:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {currentTemplate.atsScore}%
                  </span>
                </div>
                
                                 <div className="flex items-center space-x-2">
                   <span className="text-sm font-medium text-gray-700">Font:</span>
                   <span className="text-sm text-gray-600">{currentTemplate.fontFamily}</span>
                 </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Color Scheme:</span>
                  <span className="text-sm text-gray-600">{currentTemplate.colorScheme}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {currentTemplate.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* CV Preview */}
       <div className="max-w-7xl mx-auto" data-testid="template-preview">
         <div className="bg-white rounded-lg shadow-sm p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">
             Live Preview - {currentTemplate.name}
           </h3>
           
           <div className="flex justify-center">
             <div className="w-full max-w-4xl" data-testid="cv-preview">
               <CVPreview 
                 cvData={cvData} 
                 templateId={currentTemplate.id} 
               />
             </div>
           </div>
         </div>
       </div>

      {/* Template List */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Templates ({cvTemplates.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {cvTemplates.map((template, index) => (
               <div
                 key={template.id}
                 data-template-index={index}
                 data-template-id={template.id}
                 className={`p-3 rounded border cursor-pointer transition-colors ${
                   index === currentTemplateIndex
                     ? 'border-blue-500 bg-blue-50'
                     : 'border-gray-200 hover:border-gray-300'
                 }`}
                 onClick={() => handleJumpToTemplate(index)}
               >
                 <div className="flex items-center justify-between mb-2">
                   <span className="font-medium text-sm" data-template-name>{template.name}</span>
                   <span className={`px-2 py-1 rounded text-xs ${
                     template.tier === 'free' ? 'bg-green-100 text-green-800' :
                     template.tier === 'starter' ? 'bg-blue-100 text-blue-800' :
                     template.tier === 'professional' ? 'bg-purple-100 text-purple-800' :
                     'bg-yellow-100 text-yellow-800'
                   }`} data-template-tier>
                     {template.tier}
                   </span>
                 </div>
                 <p className="text-xs text-gray-600 line-clamp-2">
                   {template.description}
                 </p>
                 <div className="flex items-center justify-between mt-2">
                   <span className="text-xs text-gray-500">
                     ATS: {template.atsScore}%
                   </span>
                   <span className="text-xs text-gray-500">
                     #{index + 1}
                   </span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewGenerator; 