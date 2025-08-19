import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Linkedin, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LinkedInScraperProps {
  onDataExtracted: (data: any) => void;
}

interface LinkedInData {
  full_name: string;
  job_title: string;
  location: string;
  summary: string;
  experiences: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
}

const LinkedInScraper: React.FC<LinkedInScraperProps> = ({ onDataExtracted }) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<LinkedInData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedinPattern.test(url);
  };

  const scrapeLinkedInProfile = async () => {
    if (!validateLinkedInUrl(linkedinUrl)) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }

    setIsScraping(true);
    setError(null);

    try {
      // Simulate LinkedIn scraping (in production, this would call a backend API)
      // For now, we'll use mock data to demonstrate the functionality
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const mockData: LinkedInData = {
        full_name: 'John Smith',
        job_title: 'Senior Software Engineer',
        location: 'London, United Kingdom',
        summary: 'Experienced software engineer with 5+ years developing scalable web applications. Specialized in React, Node.js, and cloud technologies. Led teams of 3-5 developers and delivered projects worth £500K+.',
        experiences: [
          {
            role: 'Senior Software Engineer',
            company: 'TechCorp Ltd',
            duration: '2021 - Present',
            description: 'Lead development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored 3 junior developers.'
          },
          {
            role: 'Software Engineer',
            company: 'StartupXYZ',
            duration: '2019 - 2021',
            description: 'Built full-stack web applications using React and Node.js. Collaborated with product team to deliver features on time. Improved application performance by 40%.'
          }
        ],
        education: [
          {
            institution: 'University of London',
            degree: 'BSc Computer Science',
            year: '2019'
          }
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Git', 'Agile']
      };

      setScrapedData(mockData);
      toast.success('LinkedIn profile data extracted successfully!');
    } catch (err) {
      setError('Failed to scrape LinkedIn profile. Please try again or enter data manually.');
      toast.error('LinkedIn scraping failed');
    } finally {
      setIsScraping(false);
    }
  };

  const useScrapedData = () => {
    if (scrapedData) {
      // Convert LinkedIn data to CV form format
      const cvData = {
        full_name: scrapedData.full_name,
        job_title: scrapedData.job_title,
        location: scrapedData.location,
        summary: scrapedData.summary,
        experiences: scrapedData.experiences,
        education: scrapedData.education,
        skills: scrapedData.skills.join(', '),
        email: '', // LinkedIn doesn't provide email
        phone: '', // LinkedIn doesn't provide phone
        linkedin_url: linkedinUrl,
        portfolio_url: '',
        projects: [],
        languages: [],
        certifications: '',
        references: []
      };

      onDataExtracted(cvData);
      toast.success('LinkedIn data imported to CV form!');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-blue-600" />
          LinkedIn Profile Scraper
        </CardTitle>
        <CardDescription>
          Import your professional information from LinkedIn to speed up CV creation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            LinkedIn Profile URL
          </label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={scrapeLinkedInProfile}
              disabled={isScraping || !linkedinUrl.trim()}
              className="min-w-[120px]"
            >
              {isScraping ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Scrape Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {scrapedData && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Successfully extracted data from LinkedIn profile. Review the information below and click "Use This Data" to import it into your CV.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">{scrapedData.full_name}</h4>
                <p className="text-gray-600">{scrapedData.job_title}</p>
                <p className="text-sm text-gray-500">{scrapedData.location}</p>
              </div>

              {scrapedData.summary && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Summary</h5>
                  <p className="text-sm text-gray-700 line-clamp-3">{scrapedData.summary}</p>
                </div>
              )}

              <div>
                <h5 className="font-medium text-gray-900 mb-1">Experience</h5>
                <p className="text-sm text-gray-700">
                  {scrapedData.experiences.length} position{scrapedData.experiences.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-1">Skills</h5>
                <div className="flex flex-wrap gap-1">
                  {scrapedData.skills.slice(0, 5).map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {scrapedData.skills.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{scrapedData.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={useScrapedData} className="flex-1">
                Use This Data
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setScrapedData(null);
                  setLinkedinUrl('');
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-4">
          <p className="mb-2">
            <strong>Note:</strong> This feature extracts publicly available information from LinkedIn profiles.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Only public profile information is accessible</li>
            <li>Email and phone numbers are not available from LinkedIn</li>
            <li>You may need to manually add or edit some information</li>
            <li>Ensure your LinkedIn profile is up to date for best results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInScraper; 