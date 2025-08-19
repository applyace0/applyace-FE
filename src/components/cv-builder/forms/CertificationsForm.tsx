import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CVData } from '@/lib/cv/types';

interface CertificationsFormProps {
  data: CVData['certifications'];
  onChange: (data: CVData['certifications']) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  // Ensure data is always an array
  const certificationsArray = Array.isArray(data) ? data : [];

  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: ''
    };
    onChange([...certificationsArray, newCertification]);
  };

  const removeCertification = (id: string) => {
    onChange(certificationsArray.filter(cert => cert.id !== id));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onChange(certificationsArray.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  return (
    <div className="space-y-6">
      {certificationsArray.map((c, i) => (
        <Card key={c.id ?? `${c.name || "cert"}-${i}`} className="relative">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Certification {i + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(c.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Certification Name *</Label>
                <Input
                  value={c.name}
                  onChange={(e) => updateCertification(c.id, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization *</Label>
                <Input
                  value={c.issuer}
                  onChange={(e) => updateCertification(c.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="space-y-2">
                <Label>Issue Date *</Label>
                <Input
                  type="month"
                  value={c.date}
                  onChange={(e) => updateCertification(c.id, 'date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Input
                  type="month"
                  value={c.expiryDate}
                  onChange={(e) => updateCertification(c.id, 'expiryDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        onClick={addCertification}
        className="w-full border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
};

export default CertificationsForm; 