import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CertificationsFormProps {
  data: string;
  onChange: (data: string) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications & Training</Label>
        <Textarea
          id="certifications"
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="List your certifications, training programs, and professional development courses. For example:&#10;&#10;• AWS Certified Solutions Architect (2023)&#10;• Google Cloud Professional Data Engineer (2022)&#10;• Scrum Master Certification (2021)&#10;• Advanced React Development Course (2020)"
          className="min-h-[150px]"
        />
        <p className="text-sm text-gray-500">
          Include certification names, issuing organizations, and dates. You can also list relevant training programs and courses.
        </p>
      </div>
    </div>
  );
};

export default CertificationsForm;
