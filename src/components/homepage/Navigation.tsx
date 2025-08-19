import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu, X, FileText, Brain, Users } from 'lucide-react';
import ApplyAceLogo from '@/components/ui/ApplyAceLogo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavigationProps {
  onAuthClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  // Check if Apply Flow feature is enabled
  const isApplyFlowEnabled = import.meta.env.VITE_FEATURE_APPLY_FLOW === 'true';

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'CV Builder', href: '#cv-builder' },
    { name: 'Job Opportunities', href: '#job-opportunities' },
    { name: 'Applications', href: '#applications' },
    { name: 'One-Click Apply', href: '#one-click-apply' },
    { name: 'Mass Apply', href: '#mass-apply' },
    { name: 'Interview Coach', href: '#interview-coach' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const getTabColor = (index: number) => {
    switch (index) {
      case 0:
        return 'data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50';
      case 1:
        return 'data-[state=active]:text-emerald-600 data-[state=active]:bg-emerald-50';
      case 2:
        return 'data-[state=active]:text-purple-600 data-[state=active]:bg-purple-50';
      case 3:
        return 'data-[state=active]:text-amber-600 data-[state=active]:bg-amber-50';
      case 4:
        return 'data-[state=active]:text-orange-600 data-[state=active]:bg-orange-50';
      default:
        return 'data-[state=active]:text-slate-600 data-[state=active]:bg-slate-50';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ApplyAceLogo size="medium" />
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-slate-50 border border-slate-200 p-1">
                {navItems.map((item, index) => (
                  <TabsTrigger
                    key={item.name}
                    value={item.name}
                    className={`text-sm font-medium transition-colors duration-200 ${getTabColor(index)}`}
                  >
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Apply Flow Buttons */}
            {isApplyFlowEnabled && (
              <TooltipProvider>
                <div className="flex space-x-2 mr-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = '/jobs?mode=single'}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        <span className="hidden lg:inline">One-Click Apply</span>
                        <span className="lg:hidden">Apply</span>
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
                        size="sm"
                        onClick={() => window.location.href = '/jobs?mode=mass'}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        <span className="hidden lg:inline">Mass Apply</span>
                        <span className="lg:hidden">Batch</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Apply to multiple job URLs in one go</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}

            <Button
              variant="outline"
              onClick={onAuthClick}
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Login
            </Button>
            <Button
              onClick={onAuthClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Sign Up for Free
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white/95 backdrop-blur-sm">
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === item.name
                      ? getTabColor(index).replace('data-[state=active]:', '')
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 space-y-3 border-t border-slate-100 mt-4">
                {/* Apply Flow Buttons for Mobile */}
                {isApplyFlowEnabled && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/jobs?mode=single'}
                      className="w-full text-blue-700 hover:text-blue-900 hover:bg-blue-50 border-blue-200"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      One-Click Apply
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/jobs?mode=mass'}
                      className="w-full text-green-700 hover:text-green-900 hover:bg-green-50 border-green-200"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Mass Apply
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={onAuthClick}
                  className="w-full text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                >
                  Login
                </Button>
                <Button
                  onClick={onAuthClick}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                >
                  Sign Up for Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
