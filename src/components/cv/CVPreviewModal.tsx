import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CVData as DBCVData } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cvTemplates } from '@/data/cvTemplates';
import CVPreview from './CVPreview';
import { normalizeBuilder } from '@/lib/cvNormalize';
import { printCV } from '@/lib/cv/print';
import { resolveTemplateId } from './templateRegistry';

import { Printer, Download } from 'lucide-react';

interface CVPreviewModalProps {
  open: boolean;
  onClose: () => void;
  cv: DBCVData | any; // Allow server response format
  userTier?: string;
  onSaved?: () => void;
  onAnalyze?: (cvId: string) => void;
  isNewUpload?: boolean;
}

const CVPreviewModal: React.FC<CVPreviewModalProps> = ({ open, onClose, cv, userTier = 'free' }) => {
  const navigate = useNavigate();
  const [editName, setEditName] = useState(cv?.full_name || '');

  useEffect(() => {
    if (cv && open) {
      setEditName(cv.full_name || '');
    }
  }, [cv, open]);

  if (!cv || !open) return null;

  // Check if this is server response format (has 'data' field) or legacy format
  const isServerResponse = cv && typeof cv === 'object' && 'data' in cv;
  
  const normalizedCV = isServerResponse ? normalizeBuilder(cv.data) as any : normalizeBuilder(cv) as any;
  
  // prefer server data (builder JSON) over file branch
  const raw = isServerResponse ? cv.data : {};
  const hasBuilderData = raw && Object.keys(raw).length > 0;
  
  // Force template path when we have builder data
  const isStructuredCV = hasBuilderData || (!cv.file_url && (cv.content || cv.experiences || cv.education || cv.skills));
  const selectedTemplate = cv.template_id || 'modern-professional';

  const handlePrint = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from closing
    if (!isStructuredCV) return;
    
    try {
      // Pass the original normalized data to print function - let it handle page limiting
      const normalizedCV = isServerResponse ? normalizeBuilder(cv.data) : normalizeBuilder(cv);
      
      await printCV({
        cvData: normalizedCV as any, // Cast to avoid type mismatch
        template: selectedTemplate,
        userTier,
        mode: 'print'
      });
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleDownload = async () => {
    if (!isStructuredCV) return;
    
    try {
      // Pass the original normalized data to print function - let it handle page limiting
      const normalizedCV = isServerResponse ? normalizeBuilder(cv.data) : normalizeBuilder(cv);
      
      await printCV({
        cvData: normalizedCV as any, // Cast to avoid type mismatch
        template: selectedTemplate,
        userTier,
        mode: 'download'
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gray-50 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            CV Preview: {cv?.title || cv?.full_name || 'Untitled CV'}
          </DialogTitle>
          <DialogDescription>
            {`Template: ${cvTemplates.find(t => t.id === selectedTemplate)?.name || 'Modern Professional'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          {/* CV Preview */}
          <CVPreview serverCv={cv} cvData={isServerResponse ? cv.data : cv} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVPreviewModal; 