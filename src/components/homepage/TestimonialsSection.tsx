
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Software Engineer',
      content: 'The AI-optimized CV helped me get more interviews. The interview coaching gave me confidence and practical tips that really made a difference.',
      rating: 5,
      avatar: 'SM'
    },
    {
      name: 'James R.',
      role: 'Marketing Manager',
      content: 'The job matching feature is really helpful. It analyzes my CV against job descriptions and gives specific suggestions to improve my applications.',
      rating: 5,
      avatar: 'JR'
    },
    {
      name: 'Emily C.',
      role: 'Data Scientist',
      content: 'As someone who struggled with interviews, the AI coach was really useful. The feedback was detailed and helped me prepare better.',
      rating: 5,
      avatar: 'EC'
    },
    {
      name: 'Michael T.',
      role: 'UX Designer',
      content: 'The ATS optimization feature works well. My CV now gets through more filters and reaches human reviewers more often.',
      rating: 5,
      avatar: 'MT'
    },
    {
      name: 'Lisa W.',
      role: 'Product Manager',
      content: 'The platform is like having a career coach available whenever I need it. The AI gives relevant advice for my industry.',
      rating: 5,
      avatar: 'LW'
    },
    {
      name: 'David K.',
      role: 'Financial Analyst',
      content: 'The folder organization system keeps all my job applications organized. I can track which CV version I sent where easily.',
      rating: 5,
      avatar: 'DK'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What our users say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join professionals who are transforming their job search with AI-powered tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-lift rounded-xl border-slate-200 hover:border-blue-200 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
