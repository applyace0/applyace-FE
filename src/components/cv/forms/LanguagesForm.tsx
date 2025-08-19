import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface Language {
  id: string;
  language: string;
  proficiency: string;
  certification_name?: string;
}

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] = useState('');

  const addLanguage = () => {
    if (newLanguage.trim() && newProficiency) {
      const languageExists = data.some(lang => lang.language.toLowerCase() === newLanguage.trim().toLowerCase());
      if (!languageExists) {
        const newLang: Language = {
          id: `lang${Date.now()}`,
          language: newLanguage.trim(),
          proficiency: newProficiency,
          certification_name: ''
        };
        onChange([...data, newLang]);
        setNewLanguage('');
        setNewProficiency('');
      }
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    onChange(data.filter(lang => lang.language !== languageToRemove));
  };

  const updateLanguage = (oldLanguage: string, field: keyof Language, value: string) => {
    onChange(data.map(lang => 
      lang.language === oldLanguage 
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
    !data.some(existingLang => existingLang.language.toLowerCase() === lang.toLowerCase())
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
                {proficiencyLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={addLanguage}
              disabled={!newLanguage.trim() || !newProficiency}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {availableLanguages.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Suggested Languages:</Label>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.slice(0, 8).map(language => (
                <Badge
                  key={language}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => {
                    setNewLanguage(language);
                    setNewProficiency('Intermediate');
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="space-y-4">
          <Label>Your Languages ({data.length})</Label>
          <div className="space-y-3">
            {data.map(lang => (
              <div key={lang.id} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{lang.language}</div>
                  <div className="text-sm text-gray-600">{lang.proficiency}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang.language)}
                  className="text-red-500 hover:text-red-700"
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