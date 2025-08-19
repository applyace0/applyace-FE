
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Search, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      id: 'cv-builder',
      icon: FileText,
      title: 'CV Builder',
      description: 'Create ATS-optimized CVs from scratch or upload existing ones. Our AI helps optimize your CV for each job application with professional templates and formatting.',
      benefits: [
        'Upload existing CV or build from scratch',
        'AI-powered grammar correction and optimization',
        'ATS-compliant formatting for better visibility',
        'Job-specific tailoring and keyword optimization',
        'Organized folder system for multiple CV versions'
      ],
      iconGradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'interview-coach',
      icon: Users,
      title: 'Interview Coach',
      description: 'Practice with AI-generated interview questions based on your target job. Get instant feedback on your answers and improve your confidence with personalized coaching sessions.',
      benefits: [
        'Job-specific interview questions and scenarios',
        'Real-time answer feedback and improvement suggestions',
        'Tone and clarity analysis for better communication',
        'Keyword optimization for industry-specific responses',
        'Progress tracking and performance analytics'
      ],
      iconGradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'job-matching',
      icon: Search,
      title: 'Job Matching',
      description: 'Paste job descriptions and get CV optimization suggestions. Our AI analyzes keywords and requirements to help improve your match score.',
      benefits: [
        'Job description analysis and keyword extraction',
        'Keyword matching and relevance scoring',
        'CV optimization suggestions for better alignment',
        'Application tracking and success rate monitoring',
        'Success rate insights and improvement recommendations'
      ],
      iconGradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'one-click-apply',
      icon: Send,
      title: 'One-Click Apply',
      description: 'Apply to jobs quickly with AI-tailored CVs and cover letters. Our system helps optimize your application for each position.',
      benefits: [
        'Quick job applications with optimized materials',
        'AI-generated cover letters tailored to each position',
        'CV tailoring per job with keyword optimization',
        'Application tracking and status monitoring',
        'Success rate optimization and performance analytics'
      ],
      iconGradient: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything you need to land your dream job
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps job seekers and employers 
            connect more effectively than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="rounded-2xl p-8 shadow-lg border border-slate-200 bg-white flex flex-col h-full justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:scale-105 hover:border-blue-300"
              >
                <CardHeader className="pb-6">
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-r ${feature.iconGradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl text-slate-900">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${feature.iconGradient} rounded-full`}></div>
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
