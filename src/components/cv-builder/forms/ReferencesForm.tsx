import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { Reference } from '@/lib/cv/types';

interface ReferencesFormProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({ data, onChange }) => {
  const [newReference, setNewReference] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: ''
  });

  const addReference = () => {
    if (newReference.name.trim() && newReference.title.trim()) {
      const referenceExists = data.some(ref => ref.name.toLowerCase() === newReference.name.trim().toLowerCase());
      if (!referenceExists) {
        const newRef: Reference = {
          id: `ref${Date.now()}`,
          name: newReference.name.trim(),
          title: newReference.title.trim(),
          company: newReference.company.trim(),
          email: newReference.email.trim(),
          phone: newReference.phone.trim()
        };
        onChange([...data, newRef]);
        setNewReference({
          name: '',
          title: '',
          company: '',
          email: '',
          phone: ''
        });
      }
    }
  };

  const removeReference = (referenceToRemove: string) => {
    onChange(data.filter(ref => ref.name !== referenceToRemove));
  };

  const updateReference = (oldName: string, field: keyof Reference, value: string) => {
    onChange(data.map(ref => 
      ref.name === oldName 
        ? { ...ref, [field]: value }
        : ref
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addReference();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newName">Name</Label>
            <Input
              id="newName"
              value={newReference.name}
              onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="e.g., John Smith"
            />
          </div>
          <div>
            <Label htmlFor="newTitle">Title</Label>
            <Input
              id="newTitle"
              value={newReference.title}
              onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Senior Manager"
            />
          </div>
          <div>
            <Label htmlFor="newCompany">Company</Label>
            <Input
              id="newCompany"
              value={newReference.company}
              onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Tech Corp"
            />
          </div>
          <div>
            <Label htmlFor="newEmail">Email</Label>
            <Input
              id="newEmail"
              type="email"
              value={newReference.email}
              onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="john.smith@company.com"
            />
          </div>
          <div>
            <Label htmlFor="newPhone">Phone</Label>
            <Input
              id="newPhone"
              type="tel"
              value={newReference.phone}
              onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={addReference}
              disabled={!newReference.name.trim() || !newReference.title.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
          </div>
        </div>
      </div>

      {/* Existing References */}
      {data.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Added References</Label>
          <div className="space-y-3">
            {data.map((ref, index) => (
              <div key={ref.id || index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">Name</Label>
                    <Input
                      value={ref.name}
                      onChange={(e) => updateReference(ref.name, 'name', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Title</Label>
                    <Input
                      value={ref.title || ''}
                      onChange={(e) => updateReference(ref.name, 'title', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Company</Label>
                    <Input
                      value={ref.company || ''}
                      onChange={(e) => updateReference(ref.name, 'company', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Email</Label>
                    <Input
                      type="email"
                      value={ref.email || ''}
                      onChange={(e) => updateReference(ref.name, 'email', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Phone</Label>
                    <Input
                      type="tel"
                      value={ref.phone || ''}
                      onChange={(e) => updateReference(ref.name, 'phone', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReference(ref.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferencesForm; 