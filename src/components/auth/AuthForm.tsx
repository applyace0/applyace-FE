import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, FileText, Zap, Target, Shield, Award, TrendingUp, Chrome, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/homepage/Navigation';
import ApplyAceLogo from '@/components/ui/ApplyAceLogo';

const features = [
  {
    title: 'AI-Powered Job Matching',
    description: 'Our AI analyzes your profile and matches you with the perfect job opportunities.',
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: 'Smart CV Optimization',
    description: 'Get AI-powered suggestions to optimize your CV for specific roles.',
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: 'Interview Success',
    description: 'Access our comprehensive interview preparation tools and resources.',
    icon: <Target className="h-6 w-6" />,
  },
];

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'linkedin_oidc' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, signInWithProvider, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect already authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'linkedin_oidc') => {
    try {
      setSocialLoading(provider);
      console.log(`🔗 Starting ${provider} OAuth...`);
      
      const { url } = await signInWithProvider(provider);
      
      if (url) {
        console.log(`✅ ${provider} OAuth URL generated:`, url);
        // Use a more reliable redirect method
        setTimeout(() => {
          window.location.href = url;
        }, 100); // Small delay to ensure state is updated
      } else {
        throw new Error('No redirect URL returned from OAuth provider');
      }
    } catch (error) {
      console.error('Social login error:', error);
      toast.error('Failed to sign in with ' + provider);
      setSocialLoading(null); // Reset loading state on error
    }
    // Note: Don't reset loading state on success - let the redirect handle it
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Navigation onAuthClick={() => navigate('/')} />
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-24 px-8 relative overflow-hidden flex-col justify-center min-h-screen">
        <div className="relative z-10">
          <ApplyAceLogo size="large" className="mb-8" />
          <p className="text-slate-700 mb-12 text-lg">
            Join thousands of professionals who have found their dream jobs with our AI-powered platform.
          </p>
          <div className="mt-8 flex flex-col gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-5 flex items-start gap-4 relative transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Feature Icon */}
                <div
                  className={
                    "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl " +
                    (index === 0
                      ? "bg-gradient-to-br from-blue-400 to-blue-500"
                      : index === 1
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-500"
                      : "bg-gradient-to-br from-orange-400 to-orange-500")
                  }
                >
                  {feature.icon}
                </div>
                {/* Checkmark Icon (top right) */}
                <div className="absolute top-4 right-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="url(#checkGradient)" />
                    <path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="checkGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4F8CFF" />
                        <stop offset="1" stopColor="#3B6DFF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-black font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-slate-600 text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">95%</div>
              <div className="text-slate-400">Job Match Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">3x</div>
              <div className="text-slate-400">More Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">10k+</div>
              <div className="text-slate-400">Dream Jobs Found</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 min-h-screen bg-transparent">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {isLogin ? 'Access your AI-powered career toolkit' : 'Start your journey to career success'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs defaultValue={isLogin ? 'login' : 'signup'} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="login"
                  onClick={() => setIsLogin(true)}
                  className="data-[state=active]:bg-blue-200 data-[state=active]:text-slate-900"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  onClick={() => setIsLogin(false)}
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  Sign Up for Free
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-200 focus:ring-blue-200/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white border-slate-200 focus:border-blue-200 focus:ring-blue-200/20 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        to="/auth/reset-password"
                        className="text-sm text-blue-300 hover:text-blue-400"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    className="w-full h-12 border-slate-200 hover:bg-slate-50"
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'google' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                    ) : (
                      <>
                        <Chrome className="mr-2 h-5 w-5" />
                        Google
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('linkedin_oidc')}
                    className="w-full h-12 border-slate-200 hover:bg-slate-50"
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'linkedin_oidc' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                    ) : (
                      <>
                        <Linkedin className="mr-2 h-5 w-5" />
                        LinkedIn
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname" className="text-slate-700 font-medium">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up for Free'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    className="w-full h-12 border-slate-200 hover:bg-slate-50"
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'google' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                    ) : (
                      <>
                        <Chrome className="mr-2 h-5 w-5" />
                        Google
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('linkedin_oidc')}
                    className="w-full h-12 border-slate-200 hover:bg-slate-50"
                    disabled={!!socialLoading}
                  >
                    {socialLoading === 'linkedin_oidc' ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div>
                    ) : (
                      <>
                        <Linkedin className="mr-2 h-5 w-5" />
                        LinkedIn
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure Platform
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  Job Search Success
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 