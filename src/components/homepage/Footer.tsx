import { FileText } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: [
      'CV Builder',
      'Interview Coach',
      'Job Matching',
      'For Employers',
      'API'
    ],
    Company: [
      'About Us',
      'Careers',
      'Press',
      'Contact',
      'Blog'
    ],
    Resources: [
      'Help Center',
      'Privacy Policy',
      'Terms of Service',
      'Status',
      'Documentation'
    ],
    Connect: [
      'Twitter',
      'LinkedIn',
      'Facebook',
      'Instagram',
      'YouTube'
    ]
  };

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Want My Dream Job
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Empowering job seekers and employers with AI-driven tools for better career outcomes. 
              Land your dream job or find the perfect candidate with confidence.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">Growing</div>
                <div className="text-sm text-slate-400">Community</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">AI-Powered</div>
                <div className="text-sm text-slate-400">Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-slate-400">Support</div>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 HireAI Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
