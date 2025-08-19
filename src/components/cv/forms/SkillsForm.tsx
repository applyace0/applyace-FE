
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  data: string[];
  onChange: (data: string[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = [
    'JavaScript', 'React', 'Python', 'Java', 'Node.js', 'SQL', 'HTML/CSS',
    'Project Management', 'Data Analysis', 'Marketing', 'Design', 'Communication',
    'Leadership', 'Problem Solving', 'Time Management', 'Team Collaboration'
  ];

  const availableSkills = suggestedSkills.filter(skill => !data.includes(skill));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">Add Skill</Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter"
            />
          </div>
          <Button
            onClick={addSkill}
            className="mt-6"
            disabled={!newSkill.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {availableSkills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">Suggested Skills:</Label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.slice(0, 10).map(skill => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => {
                    onChange([...data, skill]);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="space-y-2">
          <Label>Your Skills ({data.length})</Label>
          <div className="flex flex-wrap gap-2">
            {data.map(skill => (
              <Badge
                key={skill}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                {skill}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 hover:bg-transparent"
                  onClick={() => removeSkill(skill)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
