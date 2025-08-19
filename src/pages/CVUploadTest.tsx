import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Brain, 
  Zap, 
  Cloud,
  Check,
  AlertCircle
} from 'lucide-react';
import CVUploader from '@/components/cv/CVUploader';
import { toast } from 'sonner';

interface ParsingResult {
  parsedText: string;
  method: 'textract' | 'cohere' | 'mammoth' | 'text';
  fileHash: string;
  warning?: string;
  filename: string;
  contentLength: number;
}

const CVUploadTest: React.FC = () => {
  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const handleParsingComplete = (result: ParsingResult) => {
    console.log('🎉 Parsing completed:', result);
    setParsingResult(result);
    toast.success(`CV parsed successfully! Method: ${result.method}`);
  };

  const handleParsingError = (error: string) => {
    console.error('❌ Parsing error:', error);
    toast.error(`Parsing failed: ${error}`);
  };

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

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'textract':
        return 'AI-powered PDF text extraction with high accuracy';
      case 'cohere':
        return 'Fallback AI parsing when Textract is unavailable';
      case 'mammoth':
        return 'DOCX document parsing';
      case 'text':
        return 'Plain text file processing';
      default:
        return 'Unknown parsing method';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CV Parsing Integration Test
          </h1>
          <p className="text-gray-600">
            Test the backend CV parsing API with Textract + Cohere fallback
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CV Upload & Parsing
            </CardTitle>
            <CardDescription>
              Upload a CV file to test the AI-powered parsing system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CVUploader 
              onParsingComplete={handleParsingComplete}
              onError={handleParsingError}
            />
          </CardContent>
        </Card>

        {/* Results Section */}
        {parsingResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Parsing Results
              </CardTitle>
              <CardDescription>
                Successfully parsed CV content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parsing Method Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getMethodIcon(parsingResult.method)}
                  <div>
                    <h4 className="font-medium">Parsing Method</h4>
                    <p className="text-sm text-gray-600">
                      {getMethodDescription(parsingResult.method)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getMethodIcon(parsingResult.method)}
                  {getMethodName(parsingResult.method)}
                </Badge>
              </div>

              {/* File Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">File Name</h4>
                  <p className="text-sm text-blue-700">{parsingResult.filename}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Content Length</h4>
                  <p className="text-sm text-green-700">{parsingResult.contentLength} characters</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">File Hash</h4>
                  <p className="text-sm text-purple-700 font-mono">
                    {parsingResult.fileHash.substring(0, 16)}...
                  </p>
                </div>
              </div>

              {/* Warning Display */}
              {parsingResult.warning && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Warning</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">{parsingResult.warning}</p>
                </div>
              )}

              <Separator />

              {/* Parsed Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="parsed-content" className="text-lg font-medium">
                    Parsed Content
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRawText(!showRawText)}
                  >
                    {showRawText ? 'Hide Raw Text' : 'Show Raw Text'}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-2">Preview (first 500 characters)</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {parsingResult.parsedText.substring(0, 500)}
                      {parsingResult.parsedText.length > 500 && '...'}
                    </p>
                  </div>

                  {/* Raw Text */}
                  {showRawText && (
                    <div className="space-y-2">
                      <Label htmlFor="raw-text">Raw Extracted Text</Label>
                      <Textarea
                        id="raw-text"
                        value={parsingResult.parsedText}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                        placeholder="Parsed content will appear here..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(parsingResult.parsedText);
                    toast.success('Parsed text copied to clipboard');
                  }}
                >
                  Copy Text
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setParsingResult(null);
                    setShowRawText(false);
                  }}
                >
                  Parse Another File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Information */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              API Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Backend Endpoint</h4>
                <code className="text-sm bg-white p-2 rounded border">
                  POST /api/cv/parse
                </code>
              </div>
              <div>
                <h4 className="font-medium mb-2">Response Format</h4>
                <code className="text-sm bg-white p-2 rounded border">
                  {`{
  success: boolean,
  parsedText: string,
  method: string,
  fileHash: string,
  warning?: string
}`}
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Parsing Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">AWS Textract (Primary)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Cohere AI (Fallback)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Mammoth.js (DOCX)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Text Parser (TXT)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CVUploadTest; 
 
 