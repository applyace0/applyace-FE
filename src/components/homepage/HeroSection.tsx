import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Target, Shield, Award, Upload, PlusCircle, ArrowRight, AlertTriangle, CheckCircle, Clock, Zap, User, Heart, Brain, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/counter';
import { Card3D, FloatingCard } from '@/components/ui/3d-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if Apply Flow feature is enabled
  const isApplyFlowEnabled = import.meta.env.VITE_FEATURE_APPLY_FLOW === 'true';

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setShowCVOptions(true);
    } else {
      onGetStartedClick();
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setShowCVOptions(false);
    navigate('/dashboard');
  };

  const handleBuildFromScratch = () => {
    setShowCVOptions(false);
    navigate('/cv-builder');
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Text content */}
            <div className="space-y-8">
              {/* Headline and Subheadline */}
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-2">
                Stop Getting Rejected. Get Hired.
              </h1>
              <p className="text-xl text-slate-700 font-medium leading-snug mb-4">
                Stop getting rejected by ATS systems and interviewers.<br/>
                AI-powered CV optimization, one-click applications, and interview coaching that actually works.
              </p>
              {/* UK-Optimized Statement */}
              <div className="text-base text-blue-700 font-semibold mb-6">
                9 out of 10 people get rejected by ATS systems before humans see their CV. AI-powered optimization that gets you past the robots and into interviews.
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isAuthenticated ? 'Create My CV Now' : 'Start Free – Build My CV Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  className="h-12 px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Pricing
                </Button>
              </div>

              {/* Apply Flow Buttons */}
              {isApplyFlowEnabled && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <TooltipProvider>
                    <div className="flex space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => navigate('/job-opportunities')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">One-Click Apply</span>
                            <span className="sm:hidden">Apply</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Browse jobs and apply to single positions</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/mass-apply')}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Mass Apply</span>
                            <span className="sm:hidden">Batch</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Apply to multiple job URLs in one go</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              )}
              
              {/* Floating Stat Card */}
              <div className="w-full max-w-md mt-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-orange-500 flex-shrink-0" />
                  <div>
                    Every worthy job application takes <span className="font-bold text-slate-900">hours</span> to complete.<br/>
                    <span className="text-orange-700 font-semibold">We cut out time-consuming tasks so you can focus on getting the job you want.</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Row (unchanged) */}
              <motion.div 
                className="flex items-center space-x-8 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-slate-900">
                    <AnimatedCounter value={40} suffix="%" />
                  </div>
                  <div className="text-sm text-slate-600">Target Interview Success</div>
                  <div className="text-xs text-slate-500">(aspirational goal)</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-slate-900">
                    £14.99
                  </div>
                  <div className="text-sm text-slate-600">Starting Price</div>
                  <div className="text-xs text-slate-500">(50% cheaper than competitors)</div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right side - Value Proposition */}
            <div className="relative lg:mt-8">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-slate-900">Complete Hiring Pipeline</h3>
                      <p className="text-sm text-slate-600">CV → Apply → Interview → Hired</p>
                      <div className="text-xs text-slate-500">No other platform offers this</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Feature cards - Pain Point Focused */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <FloatingCard delay={0.1} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:scale-105 hover:border-blue-300">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 glow-blue"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Clock className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Save Hours on Applications</h3>
                <p className="text-slate-600">
                  Every worthy job application takes hours to complete. We cut out time-consuming tasks so you can focus on getting the job you want.
                </p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.2} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/50 hover:scale-105 hover:border-green-300">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-4 glow-green"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <User className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Personalized Applications</h3>
                <p className="text-slate-600">Each application is tailored to the specific job. No more generic CVs that get ignored by recruiters.</p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.3} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200/50 hover:scale-105 hover:border-purple-300">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 glow-purple"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Interview Success</h3>
                <p className="text-slate-600">Comprehensive interview questions database. AI coaching to help you prepare with confidence and succeed.</p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.4} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d transition-all duration-300 hover:shadow-2xl hover:shadow-orange-200/50 hover:scale-105 hover:border-orange-300">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Beat ATS Systems</h3>
                <p className="text-slate-600">Many CVs get rejected by ATS systems before humans see them. Our AI helps your CV pass through filters effectively.</p>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.5} className="group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-100 card-3d transition-all duration-300 hover:shadow-2xl hover:shadow-pink-200/50 hover:scale-105 hover:border-pink-300">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 glow-pink"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Heart className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">We Take Care of You</h3>
                <p className="text-slate-600">No one else cares about your success like we do. We help you in every possible way to get that job.</p>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* CV Options Dialog */}
      <Dialog open={showCVOptions} onOpenChange={setShowCVOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your CV</DialogTitle>
            <DialogDescription>
              Choose how you'd like to get started with your CV
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="h-12 justify-start"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Existing CV
            </Button>
            <Button
              onClick={handleBuildFromScratch}
              className="h-12 justify-start"
              variant="outline"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Build from Scratch
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Upload Modal */}
      {/* {showUploadModal && (
        <CVUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )} */}
    </>
  );
};

export default HeroSection;
