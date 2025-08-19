import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, User } from 'lucide-react';

interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship?: string;
}

interface ReferencesFormProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({ data, onChange }) => {
  const [newReference, setNewReference] = useState<Omit<Reference, 'id'>>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    relationship: ''
  });

  const addReference = () => {
    if (newReference.name.trim() && newReference.title.trim() && newReference.company.trim()) {
      const referenceExists = data.some(ref => 
        ref.name.toLowerCase() === newReference.name.trim().toLowerCase() &&
        ref.company.toLowerCase() === newReference.company.trim().toLowerCase()
      );
      
      if (!referenceExists) {
        const newRef: Reference = {
          id: `ref${Date.now()}`,
          ...newReference,
          name: newReference.name.trim(),
          title: newReference.title.trim(),
          company: newReference.company.trim(),
          email: newReference.email.trim(),
          phone: newReference.phone.trim(),
          relationship: newReference.relationship?.trim() || ''
        };
        onChange([...data, newRef]);
        setNewReference({
          name: '',
          title: '',
          company: '',
          email: '',
          phone: '',
          relationship: ''
        });
      }
    }
  };

  const removeReference = (referenceId: string) => {
    onChange(data.filter(ref => ref.id !== referenceId));
  };

  const updateReference = (referenceId: string, field: keyof Reference, value: string) => {
    onChange(data.map(ref => 
      ref.id === referenceId 
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

  const isFormValid = newReference.name.trim() && newReference.title.trim() && newReference.company.trim();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="refName">Name *</Label>
            <Input
              id="refName"
              value={newReference.name}
              onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
              placeholder="e.g., John Smith"
            />
          </div>
          <div>
            <Label htmlFor="refTitle">Job Title *</Label>
            <Input
              id="refTitle"
              value={newReference.title}
              onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
              placeholder="e.g., Senior Manager"
            />
          </div>
          <div>
            <Label htmlFor="refCompany">Company *</Label>
            <Input
              id="refCompany"
              value={newReference.company}
              onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
              placeholder="e.g., Tech Corp"
            />
          </div>
          <div>
            <Label htmlFor="refEmail">Email</Label>
            <Input
              id="refEmail"
              type="email"
              value={newReference.email}
              onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
              placeholder="john.smith@company.com"
            />
          </div>
          <div>
            <Label htmlFor="refPhone">Phone</Label>
            <Input
              id="refPhone"
              value={newReference.phone}
              onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="refRelationship">Relationship</Label>
            <Input
              id="refRelationship"
              value={newReference.relationship}
              onChange={(e) => setNewReference({ ...newReference, relationship: e.target.value })}
              placeholder="e.g., Former Manager"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={addReference}
            disabled={!isFormValid}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Reference
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="space-y-4">
          <Label>Your References ({data.length})</Label>
          <div className="space-y-3">
            {data.map(ref => (
              <div key={ref.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div className="font-medium">{ref.name}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{ref.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{ref.company}</div>
                    {ref.email && (
                      <div className="text-sm text-gray-500">📧 {ref.email}</div>
                    )}
                    {ref.phone && (
                      <div className="text-sm text-gray-500">📞 {ref.phone}</div>
                    )}
                    {ref.relationship && (
                      <div className="text-sm text-gray-500 mt-1">👥 {ref.relationship}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(ref.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Tips for References:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Include 2-3 professional references who can speak to your work</li>
          <li>Choose people who know your skills and achievements well</li>
          <li>Make sure they're comfortable being contacted</li>
          <li>Include their current job title and company</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencesForm; 