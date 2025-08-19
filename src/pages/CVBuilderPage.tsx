import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Download, Eye, Palette, Check, Loader2, Database, Mail, Phone, Zap, Printer } from 'lucide-react';
import CVTemplateSelector from '@/components/cv/CVTemplateSelector';
import CVForm from '@/components/cv-builder/CVForm';
import CVPreview from '@/components/cv/CVPreview';
import { cvTemplates, getTemplateById } from '@/data/cvTemplates';
import { getSampleDataForTemplate } from '@/data/sampleCVData';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase, cvOperations } from '@/lib/supabase';
import { normalizeBuilder } from '@/lib/cvNormalize';
import { applyPageLimit } from '@/utils/pageLimit';
import { printCV } from '@/lib/cv/print';
import { getTierConfig } from '@/config/pricing';
import ApiClient, { postJson, putJson } from '@/lib/api-client';

import type { CVData } from '@/shared/types/cv';

interface CVBuilderProps {
  // Add any props if needed
}

// Helper function to resolve CV title from various sources
function resolveTitle(cvData: any, uiTitle?: string) {
  const t =
    (uiTitle ?? '').trim() ||
    (cvData?.name ?? '').trim?.() ||
    (cvData?.title ?? '').trim?.() ||
    (cvData?.personalInfo?.fullName ?? '').trim?.();
  return t || `My CV ${new Date().toLocaleDateString()}`;
}

export default function CVBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cvId: urlCvId } = useParams<{ cvId: string }>();
  
  // Get CV ID from either URL params or location state
  const cvId = urlCvId || location.state?.cvId;
  
  // Get initial data from upload flow or use defaults
  const uploadData = location.state?.initialData;
  const fromUpload = location.state?.fromUpload;
  const initialTemplate = location.state?.selectedTemplate || 'basic-modern';

  // 1. Ensure selectedTemplate state exists
  const [selectedTemplate, setSelectedTemplate] = useState<string>("basic-modern");
  // 2. Add handleTemplateSelect function
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false); // Close modal and show live preview
    // Only load sample data if no CV has been loaded and the current data is empty
    const isEmpty = !cvData || !cvData.personalInfo?.fullName;
    if (isEmpty && !hasLoadedCV) {
      setCvData(testCVData);
    }
  };
  const [showTemplateSelector, setShowTemplateSelector] = useState(!fromUpload);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showCVNameModal, setShowCVNameModal] = useState(false);
  const [cvNameInput, setCvNameInput] = useState('My CV');
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(false);
  const [hasLoadedCV, setHasLoadedCV] = useState(false);
  
  const [cvData, setCvData] = useState<CVData>({
    name: "Untitled CV",
    templateId: "basic-modern",
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    references: [],
    projects: [],
    settings: {
      maxPagesAllowed: 2,
      allowThreePages: false,
      isHarvardTemplate: false,
      showPageLimitWarning: false,
      trimmedItems: { experiences: 0, education: 0, certifications: 0, references: 0 }
    }
  });

  // Rich test data for preview
  const testCVData: CVData = {
    name: "Jane Doe's CV",
    templateId: "basic-modern",
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+44 1234 567890",
      location: "London, UK",
      linkedin: "https://linkedin.com/in/janedoe",
      website: "https://janedoe.dev",
      summary: "Senior Software Engineer with 8+ years of experience building scalable web applications, leading cross-functional teams, and delivering robust, maintainable code. Adept at collaborating with stakeholders, mentoring junior engineers, and driving projects from concept to deployment. Passionate about clean architecture, continuous learning, and leveraging technology to solve real-world problems."
    },
    experiences: [
      {
        id: "exp1",
        title: "Lead Engineer",
        company: "FinTech Solutions", // Required field
        location: "London, UK",
        startDate: "2019-03",
        endDate: "2024-01",
        current: false,
        description: "Led a team of 10 engineers to deliver a high-availability payments platform, collaborating with product managers and designers to define requirements and ensure timely delivery. Implemented CI/CD pipelines, improved system reliability by 30%, and mentored junior developers in best practices. Architected microservices handling 10M+ daily transactions with 99.9% uptime."
      },
      {
        id: "exp2",
        title: "Full Stack Developer",
        company: "EduTech Ltd", // Required field
        location: "Remote",
        startDate: "2016-06",
        endDate: "2019-02",
        current: false,
        description: "Developed and maintained e-learning platforms using React, Node.js, and PostgreSQL. Worked closely with educators to design interactive features, optimized database queries for performance, and contributed to open-source education tools. Reduced page load times by 60% through performance optimization and implemented real-time collaboration features."
      }
    ],
    education: [
      {
        id: "edu1",
        school: "University of Oxford",
        degree: "MSc Computer Science",
        field: "Computer Science",
        startDate: "2014-09",
        endDate: "2016-06"
      }
    ],
    skills: [
      { id: '1', name: 'TypeScript' },
      { id: '2', name: 'React' },
      { id: '3', name: 'Node.js' }
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Scrum Master"
    ],
    languages: [
      "English",
      "French"
    ],
    references: [
      { name: "Dr. Alan Turing", contact: "alan.turing@fintech.com" },
      { name: "Grace Hopper", contact: "grace.hopper@edutech.com" }
    ],
    projects: [
      {
        id: "proj1",
        name: "Open Source Job Board",
        description: "Created a job board platform for remote tech jobs, used by 10,000+ users.",
        technologies: ["React", "Node.js", "PostgreSQL"],
        link: "https://github.com/janedoe/job-board"
      }
    ],
    settings: {
      maxPagesAllowed: 2,
      allowThreePages: false,
      isHarvardTemplate: false,
      showPageLimitWarning: false,
      trimmedItems: { experiences: 0, education: 0, certifications: 0, references: 0 }
    }
  };

  // Load initial test data when component mounts - REMOVED to prevent interference with save process
  // useEffect(() => {
  //   // Only load test data if we're not loading a specific CV by ID and no CV has been loaded
  //   if (!cvId && !hasLoadedCV) {
  //     setCvData(testCVData);
  //   }
  // }, []); // Empty dependency array - only run once on mount

  // Load CV from database if cvId is provided
  useEffect(() => {
    if (cvId && user) {
      console.log('🟡 Loading CV with ID:', cvId, 'from URL params:', !!urlCvId, 'from state:', !!location.state?.cvId);
      loadCVFromId(cvId);
    }
  }, [cvId, user]);

  const loadCVFromId = async (id: string) => {
    setIsLoadingCV(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/cv/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load CV');
      }

      const apiCv = await response.json();
      console.log('Raw CV data from API:', apiCv);
      
      // The backend returns CV content under the 'data' field
      const cvContent = apiCv.data || apiCv;
      console.log('CV content to normalize:', cvContent);
      
      // Use the centralized normalization that handles all data shapes
      const normalized = normalizeBuilder(cvContent);
      console.log('Normalized CV data:', normalized);
      console.log('Personal info in normalized data:', normalized.personalInfo);
      console.log('Experiences count:', normalized.experiences?.length);
      console.log('Education count:', normalized.education?.length);
      console.log('Skills count:', normalized.skills?.length);

      // Set the normalized data
      setCvData(normalized);
      setHasLoadedCV(true); // Mark that a CV has been loaded
      
      console.log('CV data state updated with loaded CV:', normalized);
      
      // Set template if available
      if (apiCv.template_id) {
        setSelectedTemplate(apiCv.template_id);
      }
      
      toast.success('CV loaded successfully!');
    } catch (error) {
      console.error('Failed to load CV:', error);
      toast.error('Failed to load CV. Please try again.');
    } finally {
      setIsLoadingCV(false);
    }
  };

  // Load test data when toggle is switched - REMOVED to prevent data reset
  // useEffect(() => {
  //   if (useSampleData) {
  //     setCvData(testCVData);
  //     toast.success('Sample data loaded! You can now see the live preview.');
  //   } else {
  //     // Reset to empty data
  //     setCvData({
  //       personalInfo: {
  //         fullName: '',
  //         email: '',
  //         phone: '',
  //         location: '',
  //         linkedin: '',
  //         website: '',
  //         summary: ''
  //       },
  //       experiences: [],
  //       education: [],
  //       skills: [],
  //       certifications: [],
  //       languages: [],
  //       projects: []
  //     });
  //     toast.info('Sample data disabled. Start building your own CV!');
  //   }
  // }, [useSampleData]);

  // Auto-save functionality
  // Remove auto-save useEffect and autoSaveCV function

    // Create CV function that works with our new format
  const createCV = async (payload: { title: string; template_id: string; [key: string]: any }) => {
    // <-- the backend expects title, template_id, and CV data directly
    return postJson("/api/cv/create", payload);
  };

  // Update CV function that works with our new format
  const updateCV = async (id: string, payload: { title: string; template_id: string; [key: string]: any }) => {
    return putJson(`/api/cv/${id}`, payload);
  };

  // Save CV - Unified Logic
  const handleSaveCV = async () => {
    console.log('🟡 handleSaveCV called');
    if (!user) {
      toast.error('Please log in to save your CV');
      return;
    }
    
    console.log('🟡 User authenticated, proceeding with save');
    console.log('Current cvData before normalization:', cvData);
    
    // UNIFIED LOGIC: Always normalize cvData before save (use original untrimmed data)
    const normalizedCV = normalizeBuilder(cvData);
    
    console.log('Normalized CV data (for save):', normalizedCV);
    
    // Safety check: prevent saving if cvData is empty or malformed
    if (!normalizedCV || typeof normalizedCV !== 'object' || Object.keys(normalizedCV).length === 0) {
      console.error('Malformed or empty cvData:', normalizedCV);
      toast.error('CV data is empty or invalid. Please fill out your CV.');
      return;
    }
    
    // Check if we have meaningful data to save (not just empty fields)
    const hasPersonalInfo = normalizedCV.personalInfo?.fullName || normalizedCV.personalInfo?.email || normalizedCV.personalInfo?.summary;
    const hasExperiences = normalizedCV.experiences && normalizedCV.experiences.length > 0;
    const hasEducation = normalizedCV.education && normalizedCV.education.length > 0;
    const hasSkills = normalizedCV.skills && normalizedCV.skills.length > 0;
    
    console.log('Data validation:', { hasPersonalInfo, hasExperiences, hasEducation, hasSkills });
    
    if (!hasPersonalInfo && !hasExperiences && !hasEducation && !hasSkills) {
      toast.error('Please add some content to your CV before saving. Click "Test Populate" to load sample data.');
      return;
    }
    
    // Ensure settings exist for save (defensive check)
    if (!normalizedCV.settings) {
      normalizedCV.settings = {
        maxPagesAllowed: 2,
        allowThreePages: false,
        isHarvardTemplate: false,
        showPageLimitWarning: false,
        trimmedItems: { experiences: 0, education: 0, certifications: 0, references: 0 }
      };
    }
    
    // Store the save data and show custom modal
    setPendingSaveData(normalizedCV);
    setCvNameInput('My CV');
    setShowCVNameModal(true);
  };

  // Handle the actual save process
  const handleConfirmSave = async () => {
    if (!pendingSaveData || !cvNameInput.trim()) {
      toast.error('CV name is required');
      return;
    }

    setIsSaving(true);
    setShowCVNameModal(false);
    
    try {
      console.log('Saving CV with data:', pendingSaveData);
      console.log('CV name to save:', cvNameInput);
      console.log('Template ID:', selectedTemplate);
      console.log('CV ID (for edit):', cvId);
      
      // ✅ CRITICAL: Always save FULL untrimmed data to database
      const normalized: CVData = normalizeBuilder(pendingSaveData);
      
      // ✅ preview uses a copy; we save the normalized original
      const { limited } = applyPageLimit(normalized);
      // use `limited` only for on-screen preview (e.g., CVPreview), NOT for saving
      
      // 🔒 SAVE: Always use the FLAT untrimmed data (no nested builder)
      const savePayload: CVData = normalized;
      
      // 🚨 CRITICAL FIX: Send CV data directly, not nested under 'builder'
      const titleToSave = cvNameInput.trim() || resolveTitle(savePayload);
      const templateIdToSave = selectedTemplate;
      
      console.log("🟡 Normalized CV Data (for save):", savePayload);
      console.log("🟡 Limited CV Data (for preview only):", limited);
      console.log("🔒 SAVING: CV data directly to database:", {
        title: titleToSave,
        template_id: templateIdToSave,
        ...savePayload // <-- Send CV data directly, not nested
      });
      
      let result;
      
      // Check if we're editing an existing CV
      if (cvId) {
        console.log("🟡 Updating existing CV with ID:", cvId);
        // Call update CV function with CV data directly
        const { success, error } = await updateCV(cvId, { 
          title: titleToSave, 
          template_id: templateIdToSave, 
          ...savePayload  // <-- Send CV data directly, not nested
        });
        result = { success, error };
      } else {
        console.log("🟡 Creating new CV");
        // Call create CV function with CV data directly
        const { success, error } = await createCV({ 
          title: titleToSave, 
          template_id: templateIdToSave, 
          ...savePayload  // <-- Send CV data directly, not nested
        });
        result = { success, error };
      }
      
      console.log("🟢 Save Result:", result);
      
      if (result.success) {
        console.log("✅ CV saved successfully, data:", result.success);
        setLastSaved(new Date());
        toast.success(cvId ? 'CV updated successfully!' : 'CV saved successfully!');
        
        // Navigate to CVs section with multiple fallback options
        console.log("✅ Save succeeded, redirecting to /cvs");
        console.log("🟢 About to call navigate('/cvs')");
        
        // Try multiple redirect methods
        try {
          navigate("/cvs");
          console.log("🟢 navigate('/cvs') called successfully");
        } catch (navError) {
          console.error("🟡 Navigation error:", navError);
          // Fallback 1: Try window.location
          try {
            window.location.href = "/cvs";
            console.log("🟢 window.location.href redirect executed");
          } catch (windowError) {
            console.error("🟡 Window location error:", windowError);
            // Fallback 2: Try setTimeout with navigate
            setTimeout(() => {
              try {
                navigate("/cvs");
                console.log("🟢 setTimeout navigate('/cvs') executed");
              } catch (timeoutError) {
                console.error("🟡 Timeout navigation error:", timeoutError);
                // Final fallback: Show message and manual redirect
                toast.info('CV saved! Please go to CVs page to view your saved CV.');
              }
            }, 100);
          }
        }
      } else {
        console.error('Save failed:', result.error);
        toast.error('Failed to save CV. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save CV. Please try again.');
    } finally {
      setIsSaving(false);
      setPendingSaveData(null);
    }
  };

  // Download CV - Unified Logic
  const handleDownloadCV = async () => {
    if (!cvData) {
      toast.error('No CV data to download');
      return;
    }
    const normalizedCV = normalizeBuilder(cvData);
    try {
      await printCV({
        cvData: normalizedCV,
        template: selectedTemplate,
        userTier: 'free', // Keep watermark for free tier
        mode: 'download'
      });
      toast.success('CV downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download CV. Please try again.');
    }
  };

  // Print CV - Unified Logic
  const handlePrintCV = async () => {
    if (!cvData) {
      toast.error('No CV data to print');
      return;
    }
    const normalizedCV = normalizeBuilder(cvData);
    try {
      await printCV({
        cvData: normalizedCV,
        template: selectedTemplate,
        userTier: 'free', // Keep watermark for free tier
        mode: 'print'
      });
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print CV. Please try again.');
    }
  };

  // Add a test populate button for development/testing
  const handleTestPopulate = () => {
    console.log('🚨 Test populate triggered');
    console.log('🔍 DEBUG: Current cvData before test populate:', cvData);
    console.log('🔍 DEBUG: Selected template:', selectedTemplate);
    
    // Don't override saved CV data - only load test data if no CV has been loaded
    if (hasLoadedCV) {
      toast.info('You have a saved CV loaded. Please save or discard it before loading test data.');
      return;
    }
    
    // Use our actual sample data with 5 experiences to test trimming
    import('@/data/sampleCVData').then(({ getSampleDataForTemplate }) => {
      console.log('🔍 DEBUG: Import successful');
      const testData = getSampleDataForTemplate(selectedTemplate || 'basic-modern');
      
      console.log('🔍 DEBUG: Sample data loaded:', {
        experiences: testData.experiences?.length || 0,
        education: testData.education?.length || 0,
        certifications: testData.certifications?.length || 0,
        references: testData.references?.length || 0,
        projects: testData.projects?.length || 0
      });
      
      console.log('🔍 DEBUG: Full test data:', testData);
      console.log('🔍 DEBUG: Experiences count:', testData.experiences?.length);
      console.log('🔍 DEBUG: First experience:', testData.experiences?.[0]);
      setCvData(testData);
      console.log('🔍 DEBUG: cvData state updated with new data');
      toast.success(`Comprehensive test data loaded! This CV includes ${testData.experiences?.length || 0} experiences with detailed JDs for testing print/preview trimming.`);
    }).catch(error => {
      console.error('❌ Error loading sample data:', error);
      toast.error('Failed to load sample data');
    });
  };

  // JWT-authenticated analytics call example
  const fetchAnalytics = async () => {
    try {
      const response = await getJson('/api/analytics/usage');
      // handle response as needed
      return response;
    } catch (error) {
      console.debug("Analytics unavailable (dev):", error);
      return null;
    }
  };

  const currentTemplate = getTemplateById(selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">CV Builder</h1>
                {currentTemplate && (
                  <p className="text-sm text-gray-500">
                    Template: {currentTemplate.name}
                  </p>
                )}
                {lastSaved && !useSampleData && (
                  <p className="text-xs text-green-600">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sample Data Toggle */}
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Sample Data</span>
                <Switch
                  checked={useSampleData}
                  onCheckedChange={setUseSampleData}
                  className="ml-2"
                />
              </div>

              {fromUpload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center space-x-2"
                >
                  <Palette className="h-4 w-4" />
                  <span>Change Template</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintCV}
                className="flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCV}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              
              <Button
                onClick={handleSaveCV}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save CV
                  </>
                )}
              </Button>

              {/* Test navigation button */}
              <Button
                onClick={() => {
                  console.log("🟡 Test navigation button clicked");
                  try {
                    navigate("/cvs");
                    console.log("🟢 Test navigation successful");
                  } catch (error) {
                    console.error("🟡 Test navigation failed:", error);
                  }
                }}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>Test Navigate to CVs</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTestPopulate}
                className="flex items-center space-x-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Test Populate</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showTemplateSelector ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Template
              </h2>
              <p className="text-gray-600">
                Select a professional template to get started with your CV
              </p>
            </div>
            
            <CVTemplateSelector
              onSelectTemplate={handleTemplateSelect}
              userTier="elite"
              showAllTemplates={true}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: CV Builder Form */}
            <div className="flex flex-col">
              {/* Sample Data Notice */}
              {useSampleData && (
                <Card className="border-blue-200 bg-blue-50 mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Sample Data Mode</h4>
                        <p className="text-sm text-blue-800">
                          You're viewing sample data to see how your CV will look. 
                          Toggle off to start building your own CV!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Template Selector UI */}
              <div className="flex gap-2 my-4">
                {['basic-modern', 'modern-professional', 'classic-elegant'].map((templateId) => (
                  <button
                    key={templateId}
                    onClick={() => handleTemplateSelect(templateId)}
                    className={`px-3 py-2 rounded border ${selectedTemplate === templateId ? 'bg-blue-600 text-white' : 'bg-white'}`}
                  >
                    {templateId.replace('-', ' ')}
                  </button>
                ))}
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-3 py-2 rounded border bg-gray-100 text-blue-700 hover:bg-blue-50 ml-2"
                >
                  Back to Template Selector
                </button>
              </div>

              {/* CV Builder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span>CV Builder</span>
                    {useSampleData && (
                      <Badge variant="secondary" className="ml-2">
                        Sample Data
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {useSampleData 
                      ? 'View sample data to see how your CV will look with this template'
                      : 'Fill in your information to create a professional CV'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CVForm
                    cvData={cvData}
                    onDataChange={setCvData}
                    templateId={selectedTemplate}
                  />
                </CardContent>
              </Card>

              {/* Template Info */}
              {currentTemplate && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5 text-purple-600" />
                      <span>Template Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Template</h4>
                        <p className="text-gray-600">{currentTemplate.name}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">ATS Score</h4>
                        <Badge variant="outline" className="text-green-600">
                          {currentTemplate.atsScore || 95}%
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Category</h4>
                        <Badge variant="outline">
                          {currentTemplate.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Right: CV Preview */}
            <div className="flex flex-col items-stretch justify-start w-full">
              <CVPreview cvData={cvData} selectedTemplate={selectedTemplate} />
            </div>
          </div>
        )}
      </div>
      
      {/* Custom CV Name Modal */}
      {showCVNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">ApplyAce says</h3>
            <p className="text-gray-600 mb-4">Enter a name for your CV:</p>
            <input
              type="text"
              value={cvNameInput}
              onChange={(e) => setCvNameInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My CV"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCVNameModal(false);
                  setPendingSaveData(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 