import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Language } from '@/lib/cv/types';

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] = useState('');

  const addLanguage = () => {
    if (newLanguage.trim() && newProficiency) {
      const languageExists = data.some(lang => (lang.name || lang.language || '').toLowerCase() === newLanguage.trim().toLowerCase());
      if (!languageExists) {
        const newLang: Language = {
          id: `lang${Date.now()}`,
          name: newLanguage.trim(),
          proficiency: newProficiency,
        };
        onChange([...data, newLang]);
        setNewLanguage('');
        setNewProficiency('');
      }
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    onChange(data.filter(lang => (lang.name || lang.language || '') !== languageToRemove));
  };

  const updateLanguage = (oldLanguage: string, field: keyof Language, value: string) => {
    onChange(data.map(lang => 
      (lang.name || lang.language || '') === oldLanguage 
        ? { ...lang, [field]: value }
        : lang
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

  const proficiencyLevels = [
    'Native',
    'Fluent',
    'Professional',
    'Advanced',
    'Intermediate',
    'Basic',
    'Conversational'
  ];

  const suggestedLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'
  ];

  const availableLanguages = suggestedLanguages.filter(lang => 
    !data.some(existingLang => (existingLang.name || existingLang.language || '').toLowerCase() === lang.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <Label htmlFor="newLanguage">Language</Label>
            <Input
              id="newLanguage"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Spanish"
            />
          </div>
          <div>
            <Label htmlFor="newProficiency">Proficiency</Label>
            <Select value={newProficiency} onValueChange={setNewProficiency}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={addLanguage}
              disabled={!newLanguage.trim() || !newProficiency}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Suggested Languages */}
        {availableLanguages.length > 0 && (
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Quick Add:</Label>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.slice(0, 6).map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewLanguage(lang);
                    setNewProficiency('Intermediate');
                  }}
                  className="text-xs"
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Existing Languages */}
      {data.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Added Languages</Label>
          <div className="space-y-2">
            {data.map((lang, index) => (
              <div key={lang.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-600">Language</Label>
                    <Input
                      value={lang.name || lang.language || ''}
                      onChange={(e) => updateLanguage(lang.name || lang.language || '', 'name', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Proficiency</Label>
                    <Select 
                      value={lang.proficiency || lang.level || ''} 
                      onValueChange={(value) => updateLanguage(lang.name || lang.language || '', 'proficiency', value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {proficiencyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang.name || lang.language || '')}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesForm; 