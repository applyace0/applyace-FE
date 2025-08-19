import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TIERS, PAYG_PRICE_PER_APPLY } from '@/config/pricing';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '£0',
      period: '/month',
      description: '1 apply per month, basic CV builder and upload',
      features: [
        '1 apply per month',
        'Basic CV builder',
        'CV upload and analysis',
        'Email support'
      ],
      buttonText: 'Start Free',
      popular: false,
      gradient: 'from-slate-50 to-white',
      buttonStyle: 'bg-slate-800 hover:bg-slate-900 text-white'
    },
    {
      name: 'Pay-As-You-Go',
      price: `£${PAYG_PRICE_PER_APPLY}`,
      period: ' per apply',
      description: 'No monthly commitment, pay only for what you use',
      features: [
        'Pay per apply',
        'Unlimited CV uploads',
        'Basic CV builder',
        'Email support'
      ],
      buttonText: 'Pay Per Apply',
      popular: false,
      gradient: 'from-gray-50 to-white',
      buttonStyle: 'bg-gray-700 hover:bg-gray-900 text-white'
    },
    {
      name: 'Starter',
      price: '£11.99',
      period: '/month',
      description: '5 applies per month, perfect for students and early careers',
      features: [
        '5 applies per month',
        'Unlimited CV uploads',
        'All CV builder features',
        'Priority email support'
      ],
      buttonText: 'Start Starter',
      popular: false,
      gradient: 'from-green-50 to-white',
      buttonStyle: 'bg-green-700 hover:bg-green-900 text-white'
    },
    {
      name: 'Professional',
      price: '£17.99',
      period: '/month',
      description: '150 applies per month, advanced AI features',
      features: [
        '150 applies per month',
        'Unlimited CV uploads',
        'Advanced CV builder & templates',
        'AI interview simulation',
        'Job match suggestions',
        'Priority support'
      ],
      buttonText: 'Start Professional',
      popular: true,
      gradient: 'from-blue-50 to-indigo-50',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
    },
    {
      name: 'Career Pro',
      price: '£35.99',
      period: '/month',
      description: '300 applies per month, human review and premium coaching',
      features: [
        '300 applies per month',
        'All Professional features',
        'Personal human review of CV',
        'AI-enhanced mock interviews',
        'Direct apply integrations',
        'Early access to new features'
      ],
      buttonText: 'Go Career Pro',
      popular: false,
      gradient: 'from-purple-50 to-pink-50',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
    },
    {
      name: 'Elite Executive',
      price: '£69.99',
      period: '/month',
      description: '450 applies per month (fair usage), AI-backed 1-on-1 coaching sessions',
      features: [
        '450 applies per month (fair usage)',
        'All Career Pro features',
        'AI-backed 1-on-1 coaching sessions',
        'Executive job market access',
        'Discreet search tools',
        'White-glove support'
      ],
      buttonText: 'Elite Executive',
      popular: false,
      gradient: 'from-yellow-50 to-orange-50',
      buttonStyle: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white',
      eliteLink: '/elite-executive'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Simple, transparent pricing</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose your plan
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core AI-powered features 
            to help you land your dream job.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan, idx) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col h-full justify-between rounded-2xl shadow-lg border border-slate-200 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:scale-105 hover:border-blue-300 ${
                    plan.popular
                      ? 'border-2 border-blue-400 bg-white z-10'
                      : plan.gradient ? `bg-gradient-to-br ${plan.gradient}` : 'bg-white border border-slate-200'
                  }`}
                  style={{ minHeight: '520px' }}
                >
                  {/* Most Popular Badge - only for Professional card */}
                  {plan.popular && (
                    <div className="absolute left-1/2 -top-8 -translate-x-1/2 z-20 pointer-events-none">
                      <span className="inline-block bg-blue-600 text-white text-base font-extrabold px-8 py-2 rounded-full shadow-2xl animate-float tracking-wide border-4 border-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-xl font-bold text-slate-900 mb-1">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 text-sm">{plan.period}</span>
                    </div>
                    <CardDescription className="text-slate-600 text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 px-6 pb-8">
                    {plan.eliteLink ? (
                      <Link to={plan.eliteLink}>
                        <Button className={`w-full mb-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${plan.buttonStyle}`}>
                          {plan.buttonText}
                        </Button>
                      </Link>
                    ) : (
                      <Button className={`w-full mb-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 ${plan.buttonStyle}`}>
                        {plan.buttonText}
                      </Button>
                    )}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-green-600 bg-green-100 rounded-full p-0.5" />
                          </div>
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
