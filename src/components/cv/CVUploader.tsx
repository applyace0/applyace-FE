import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  Loader2, 
  FileCheck,
  FileX,
  RefreshCw,
  Brain,
  Zap,
  Cloud
} from 'lucide-react';
import { toast } from 'sonner';
import { cvAPI } from '@/lib/api';
import { postJson } from '@/lib/api-client';

interface ParsingResult {
  parsedText: string;
  method: 'textract' | 'cohere' | 'mammoth' | 'text';
  fileHash: string;
  warning?: string;
  filename: string;
  contentLength: number;
}

interface CVUploaderProps {
  onParsingComplete: (result: ParsingResult) => void;
  onError?: (error: string) => void;
  className?: string;
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

const CVUploader: React.FC<CVUploaderProps> = ({ 
  onParsingComplete, 
  onError,
  className = "" 
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingStatus, setParsingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsingMethod, setParsingMethod] = useState<'textract' | 'cohere' | 'mammoth' | 'text' | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation function
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`;
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not supported. Please upload ${ALLOWED_EXTENSIONS.join(', ')} files`;
    }
    
    return null;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setError(null);
      setUploadedFile(file);
      setParsingStatus('');
      setParsingMethod(null);
      setWarning(null);
      console.log('File uploaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    }
  };

  // Handle file drop
  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      setError(null);
      setUploadedFile(file);
      setParsingStatus('');
      setParsingMethod(null);
      setWarning(null);
      console.log('File dropped:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    }
  };

  // Handle drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Parse file using backend API
  const parseFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError(null);
    setParsingStatus('Uploading file...');
    setParsingMethod(null);
    setWarning(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('cvFile', uploadedFile);

      // Call backend parsing API
      setParsingStatus('Parsing via Textract...');
      setParsingMethod('textract');

      const result: ParsingResult = await postJson('/api/cv/parse', formData);
      
      console.log('✅ Parsing completed:', {
        method: result.method,
        contentLength: result.contentLength,
        warning: result.warning
      });

      setParsingMethod(result.method);
      setWarning(result.warning || null);

      // Show success message
      const methodNames = {
        textract: 'AWS Textract',
        cohere: 'Cohere AI',
        mammoth: 'Mammoth.js',
        text: 'Text Parser'
      };

      toast.success(`CV parsed successfully using ${methodNames[result.method]}`);

      if (result.warning) {
        toast.warning(result.warning);
      }

      // Call the callback with the parsing result
      onParsingComplete(result);

    } catch (err: any) {
      console.error('❌ Parsing failed:', err);
      const errorMessage = err.message || 'Failed to parse CV file';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setParsingStatus('');
    }
  };

  // Retry parsing
  const retryParsing = () => {
    setError(null);
    parseFile();
  };

  // Get method icon
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'textract':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'cohere':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'mammoth':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get method name
  const getMethodName = (method: string) => {
    switch (method) {
      case 'textract':
        return 'AWS Textract';
      case 'cohere':
        return 'Cohere AI';
      case 'mammoth':
        return 'Mammoth.js';
      case 'text':
        return 'Text Parser';
      default:
        return method;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold">Upload Your CV</h3>
        <p className="text-muted-foreground">
          Upload your CV file and we'll extract the content using AI-powered parsing
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* File Upload Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <FileCheck className="h-5 w-5" />
                    <span className="font-medium">{uploadedFile.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={parseFile}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Parsing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Parse CV
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setUploadedFile(null);
                        setError(null);
                        setParsingStatus('');
                        setParsingMethod(null);
                        setWarning(null);
                      }}
                    >
                      <FileX className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">
                      PDF, DOCX, or TXT files up to 10MB
                    </p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>

            {/* Parsing Status */}
            {isProcessing && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  {parsingStatus}
                </AlertDescription>
              </Alert>
            )}

            {/* Parsing Method Display */}
            {parsingMethod && !isProcessing && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="flex items-center gap-2">
                    <span>Parsed using</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getMethodIcon(parsingMethod)}
                      {getMethodName(parsingMethod)}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Warning Display */}
            {warning && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {warning}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={retryParsing}
                      className="ml-2"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Supported Formats Info */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-medium mb-2">Supported Formats</h4>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                PDF
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                DOCX
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                TXT
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PDF files use AI-powered parsing (Textract + Cohere fallback)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVUploader; 
 
 