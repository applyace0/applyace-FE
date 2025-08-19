import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Crown, Shield, Eye, Lock, Zap, Target, Globe, Award, CheckCircle, Star, ArrowRight, Play, Users, TrendingUp, Brain, Briefcase, Sparkles, ChevronLeft, ChevronRight, Layers, Database, Cpu, Cloud, BarChart, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';

// Enhanced cursor with purple trail effect
const EliteCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<Array<{x: number, y: number, id: number}>>([]);

  useEffect(() => {
    let trailId = 0;

    const updateCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Add trail point
      setTrail(prevTrail => {
        const newPoint = { x: e.clientX, y: e.clientY, id: trailId++ };
        const newTrail = [newPoint, ...prevTrail.slice(0, 8)]; // Keep last 8 points
        return newTrail;
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updateCursor);
    
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Trail points */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="elite-mouse-trail"
          style={{
            transform: `translate(${point.x}px, ${point.y}px)`,
            opacity: (1 - index / trail.length) * 0.6,
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
      
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="elite-cursor-dot"
        style={{
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      />
    </>
  );
};

// Counter animation hook
const useCounter = (end: number, duration: number = 2000, suffix: string = '') => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOutCubic));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return { count, countRef, suffix };
};

// Counter component for elite stats
const CounterStat = ({ end, suffix, label, delay, prefix = '', isDecimal = false }: { 
  end: number; 
  suffix: string; 
  label: string; 
  delay: string; 
  prefix?: string;
  isDecimal?: boolean;
}) => {
  const { count, countRef } = useCounter(end, 2500);
  
  const displayValue = isDecimal ? (count / 10).toFixed(1) : count;
  
  return (
    <div className="elite-stat-card elite-fade-in" style={{ animationDelay: delay }} ref={countRef}>
      <div className="elite-stat-number">{prefix}{displayValue}{suffix}</div>
      <div className="elite-stat-label">{label}</div>
    </div>
  );
};

// Executive Network Integration - 3 rows with meaningful icons and descriptions
const ExecutiveNetworkIntegration = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const firstRowIcons = [
    { icon: Shield, name: "Private Equity" },
    { icon: Crown, name: "Investment Banking" },
    { icon: Target, name: "Executive Search" },
    { icon: Award, name: "Board Networks" }
  ];
  
  const secondRowIcons = [
    { icon: Globe, name: "Venture Capital" },
    { icon: Briefcase, name: "Consulting Firms" },
    { icon: Users, name: "C-Suite Networks" },
    { icon: TrendingUp, name: "Growth Equity" }
  ];

  const thirdRowIcons = [
    { icon: Brain, name: "Think Tanks" },
    { icon: Zap, name: "Tech Unicorns" },
    { icon: Database, name: "Family Offices" },
    { icon: Settings, name: "Hedge Funds" }
  ];

  // Counter animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter-animate');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toString();
        }
      };

      updateCounter();
    });
  };

  return (
    <div ref={sectionRef} className="executive-network-section">
      <div className="executive-network-content">
        <h3 className="network-title">Exclusive Access to Hidden Executive Markets</h3>
        <p className="network-description">
          Our AI continuously monitors and connects with 500+ elite networks, private equity firms, 
          and executive search consultancies to surface opportunities before they become public.
        </p>
        
        <div className="seamless-integration-window">
          <div className="seamless-integration-container">
            {/* First Row - Left to Right */}
            <div className="seamless-integration-row move-left-to-right">
              {firstRowIcons.map((item, iconIndex) => (
                <div key={iconIndex} className="seamless-integration-icon" title={item.name}>
                  <item.icon className="w-5 h-5" />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {firstRowIcons.map((item, iconIndex) => (
                <div key={`dup-${iconIndex}`} className="seamless-integration-icon" title={item.name}>
                  <item.icon className="w-5 h-5" />
                </div>
              ))}
            </div>
            
            {/* Second Row - Right to Left */}
            <div className="seamless-integration-row move-right-to-left">
              {secondRowIcons.map((item, iconIndex) => (
                <div key={iconIndex} className="seamless-integration-icon" title={item.name}>
                  <item.icon className="w-5 h-5" />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {secondRowIcons.map((item, iconIndex) => (
                <div key={`dup-${iconIndex}`} className="seamless-integration-icon" title={item.name}>
                  <item.icon className="w-5 h-5" />
                </div>
              ))}
            </div>

            {/* Third Row - Left to Right */}
            <div className="seamless-integration-row move-left-to-right">
              {thirdRowIcons.map((item, iconIndex) => (
                <div key={iconIndex} className="seamless-integration-icon" title={item.name}>
                  <item.icon className="w-5 h-5" />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {thirdRowIcons.map((item, iconIndex) => (
                <div key={`dup-${iconIndex}`} className="seamless-integration-icon" title={item.name}>
                  <item.icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="network-stats">
          <div className="network-stat">
            <span className="stat-number counter-animate" data-target="500">0</span>
            <span className="stat-plus">+</span>
            <span className="stat-label">Elite Networks</span>
          </div>
          <div className="network-stat">
            <span className="stat-number counter-animate" data-target="80">0</span>
            <span className="stat-plus">%</span>
            <span className="stat-label">Hidden Opportunities</span>
          </div>
          <div className="network-stat">
            <span className="stat-number">24</span>
            <span className="stat-plus">/7</span>
            <span className="stat-label">Market Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Landio-style Stacked Cards Carousel
const SuccessStoriesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      quote: "ApplyAce secured my transition from FTSE 100 CEO to Private Equity Partner with complete discretion.",
      author: "Sarah M.",
      position: "Former FTSE 100 CEO → PE Partner",
      company: "Blackstone Group"
    },
    {
      id: 2,
      quote: "The AI identified a Chairman role that wasn't even on the market yet. Three weeks later, I had the position with a £1.8M package.",
      author: "James R.",
      position: "Chairman, Tech Unicorn", 
      company: "Revolut"
    },
    {
      id: 3,
      quote: "Complete confidentiality during my transition from Global MD to CEO. The executive narrative positioning was so precise.",
      author: "Michael K.",
      position: "CEO, Global Manufacturing",
      company: "Rolls-Royce"
    }
  ];

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="landio-carousel">
      <div className="stacked-cards-container">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`stacked-card ${
              index === currentSlide ? 'active' : 
              index < currentSlide ? 'prev' : 'next'
            }`}
            style={{
              zIndex: testimonials.length - Math.abs(index - currentSlide),
              transform: `
                translateX(${(index - currentSlide) * 20}px) 
                translateY(${Math.abs(index - currentSlide) * 10}px)
                scale(${1 - Math.abs(index - currentSlide) * 0.05})
              `,
            }}
            onClick={() => goToSlide(index)}
          >
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
              ))}
            </div>
            <p className="testimonial-quote">"{testimonial.quote}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">{testimonial.author.charAt(0)}</div>
              <div className="author-info">
                <h4>{testimonial.author}</h4>
                <p>{testimonial.position}</p>
                <span>{testimonial.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Background orbs with mouse tracking
const BackgroundOrbs = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  return (
    <div className="elite-background-orbs">
      {/* Purple orb */}
      <div 
        className="elite-orb elite-orb-purple"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      
      {/* Blue orb */}
      <div 
        className="elite-orb elite-orb-blue"
        style={{
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`,
        }}
      />
      
      {/* Violet orb */}
      <div 
        className="elite-orb elite-orb-violet"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`,
        }}
      />
    </div>
  );
};

// Crown animation component with circles and fade-out
const CrownWithCircles: React.FC<{ onCirclesDisappear: (disappeared: boolean) => void }> = ({ onCirclesDisappear }) => {
  const [showCircles, setShowCircles] = useState(true);
  const [showCrown, setShowCrown] = useState(true);

  useEffect(() => {
    // Hide circles after 5 seconds
    const circlesTimer = setTimeout(() => {
      setShowCircles(false);
      onCirclesDisappear(true);
    }, 5000);

    // Hide crown after 7 seconds (2 seconds after circles disappear)
    const crownTimer = setTimeout(() => {
      setShowCrown(false);
    }, 7000);

    return () => {
      clearTimeout(circlesTimer);
      clearTimeout(crownTimer);
    };
  }, [onCirclesDisappear]);

  return (
    <div className="crown-container">
      {/* Pulsating circles around crown */}
      {showCircles && (
        <div className="crown-circles">
          <div className="crown-circle crown-circle-1"></div>
          <div className="crown-circle crown-circle-2"></div>
          <div className="crown-circle crown-circle-3"></div>
        </div>
      )}
      
      {/* Crown icon with fade-out */}
      {showCrown && (
        <Crown className={`crown-icon ${!showCircles ? 'crown-fade-out' : ''}`} size={64} />
      )}
    </div>
  );
};

// Simplified Professional Hero Background with Crown Animation
const HolographicHero: React.FC<{ onCirclesDisappear: (disappeared: boolean) => void }> = ({ onCirclesDisappear }) => {
  return (
    <div className="hero-container">
      {/* Crown with circles */}
      <CrownWithCircles onCirclesDisappear={onCirclesDisappear} />
      
      {/* Minimal particles */}
      <div className="hero-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              left: `${20 + (i * 10)}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient lighting */}
      <div className="hero-ambient-light hero-ambient-1"></div>
      <div className="hero-ambient-light hero-ambient-2"></div>
    </div>
  );
};

// Elite Executive Arsenal section with scroll-triggered animations
const EliteExecutiveArsenal: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards(prev => [...prev, index]);
              observer.disconnect();
            }
          },
          { threshold: 0.2, rootMargin: '50px' }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const arsenalItems = [
    {
      icon: Shield,
      title: "AI-Powered Profile Shield",
      description: "Advanced algorithms protect and optimize your professional presence across all platforms",
      direction: "left"
    },
    {
      icon: Target,
      title: "Precision Career Targeting",
      description: "Laser-focused positioning that aligns with C-suite expectations and industry demands",
      direction: "right"
    },
    {
      icon: Crown,
      title: "Executive Authority Builder",
      description: "Establish unquestionable leadership credibility through strategic narrative construction",
      direction: "left"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Elite Executive Arsenal
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Exclusive tools and strategies reserved for C-suite professionals
          </p>
        </div>

        <div className="space-y-12">
          {arsenalItems.map((item, index) => (
            <div
              key={index}
              ref={el => cardRefs.current[index] = el}
              className={`arsenal-card ${visibleCards.includes(index) ? 'arsenal-card-visible' : ''} arsenal-slide-${item.direction}`}
            >
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-purple-600/20 rounded-xl">
                    <item.icon className="w-12 h-12 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 text-lg">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EliteExecutive: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'semi-annual' | 'annual'>('monthly');
  const [circlesDisappeared, setCirclesDisappeared] = useState(false);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for fade-in animations with staggered delays
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered delay for sequential animation
            setTimeout(() => {
              entry.target.classList.add('elite-fade-in-visible');
            }, index * 150); // 150ms delay between each element
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('.elite-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handlePayment = async (billingCycle: 'monthly' | 'semi-annual' | 'annual') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
      if (!stripe) throw new Error('Stripe failed to load');

      const priceIds = {
        monthly: 'price_elite_monthly',
        'semi-annual': 'price_elite_semi_annual',
        annual: 'price_elite_annual'
      };

      const response = await fetch(`/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceIds[billingCycle],
          userId: user.id
        })
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
    }
  };

  const pricing = {
    monthly: { price: '£71.99', originalPrice: '£99.99', savings: '' },
    'semi-annual': { price: '£50.39', originalPrice: '£71.99', savings: '30% OFF' },
    annual: { price: '£35.99', originalPrice: '£71.99', savings: '50% OFF' }
  };

  return (
    <div className="elite-executive-page">
      <EliteCursor />
      <BackgroundOrbs mousePosition={mousePosition} />
      
      {/* Removed floating 3D elements */}

      {/* Hero Section with Better Spacing */}
      <section className="elite-hero elite-hero-improved-spacing">
        <HolographicHero onCirclesDisappear={setCirclesDisappeared} />
        <div className="elite-container">
          <div className="elite-fade-in hero-content-entrance" style={{ animationDelay: '1.5s' }}>
            <div className="elite-crown-badge elite-crown-badge-spaced">
              <Crown className="w-6 h-6" />
              <span>Elite Executive</span>
            </div>
          </div>
          
          <h1 className="elite-hero-title elite-hero-title-spaced elite-fade-in hero-title-entrance" style={{ animationDelay: '2s' }}>
            Discreet Executive
            <br />
            <span className="elite-gradient-text">Job Search Mastery</span>
          </h1>
          
          <p className="elite-hero-subtitle elite-hero-subtitle-spaced elite-fade-in hero-subtitle-entrance" style={{ animationDelay: '2.5s' }}>
            For C-suite executives who need absolute discretion, zero visibility risk,
            <br />
            and AI-powered access to the hidden executive job market.
          </p>
          
          <div className="elite-hero-pricing elite-hero-pricing-spaced elite-fade-in hero-pricing-entrance" style={{ animationDelay: '3s' }}>
            <div className="elite-pricing-toggle">
              <button
                className={`elite-toggle-btn ${selectedPlan === 'monthly' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                Monthly
              </button>
              <button
                className={`elite-toggle-btn ${selectedPlan === 'semi-annual' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('semi-annual')}
              >
                6 Months
                <span className="elite-savings-badge">30% OFF</span>
              </button>
              <button
                className={`elite-toggle-btn ${selectedPlan === 'annual' ? 'active' : ''}`}
                onClick={() => setSelectedPlan('annual')}
              >
                Annual
                <span className="elite-savings-badge">50% OFF</span>
              </button>
            </div>
            
            <div className="elite-price-display">
              <span className="elite-price">{pricing[selectedPlan].price}</span>
              <span className="elite-price-period">/month</span>
              {pricing[selectedPlan].savings && (
                <span className="elite-original-price">{pricing[selectedPlan].originalPrice}</span>
              )}
            </div>
            
            <button
              className="elite-cta-button spectacular-button"
              onClick={() => handlePayment(selectedPlan)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Elite Journey'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            The Executive Dilemma
          </h2>
          
          <div className="elite-pain-points">
            <div className="elite-pain-point elite-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="elite-pain-icon">
                <Eye className="w-8 h-8" />
              </div>
              <h3>Visibility Risk</h3>
              <p>Your current company, board members, or industry contacts cannot know you're exploring opportunities.</p>
            </div>
            
            <div className="elite-pain-point elite-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="elite-pain-icon">
                <Lock className="w-8 h-8" />
              </div>
              <h3>Hidden Market Access</h3>
              <p>80% of C-suite roles are never posted publicly. You need insider access to opportunities before they're announced.</p>
            </div>
            
            <div className="elite-pain-point elite-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="elite-pain-icon">
                <Brain className="w-8 h-8" />
              </div>
              <h3>Strategic Positioning</h3>
              <p>Your executive narrative must be crafted with surgical precision to command 7-figure compensation packages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cascade Section */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            Elite Executive Arsenal
          </h2>
          
          <div className="elite-features-cascade">
            <div className="elite-feature-card elite-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <div className="elite-feature-icon">
                <Shield className="w-12 h-12" />
              </div>
              <div className="elite-feature-content">
                <h3>Zero Visibility Risk</h3>
                <p>Military-grade encryption, NDAs with all parties, and completely offline profile optimization. Your search remains invisible.</p>
                <ul>
                  <li>No LinkedIn tracking or profile changes</li>
                  <li>Encrypted communication channels</li>
                  <li>Anonymous market research</li>
                </ul>
              </div>
            </div>
            
            <div className="elite-feature-card elite-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="elite-feature-icon">
                <Target className="w-12 h-12" />
              </div>
              <div className="elite-feature-content">
                <h3>Hidden Market Intelligence</h3>
                <p>AI monitors 500+ executive search firms, private equity networks, and board connections for opportunities before they go public.</p>
                <ul>
                  <li>Pre-announcement opportunity alerts</li>
                  <li>Executive search firm relationships</li>
                  <li>Board network intelligence</li>
                </ul>
              </div>
            </div>
            
            <div className="elite-feature-card elite-slide-in-left" style={{ animationDelay: '0.5s' }}>
              <div className="elite-feature-icon">
                <Crown className="w-12 h-12" />
              </div>
              <div className="elite-feature-content">
                <h3>C-Suite Narrative Mastery</h3>
                <p>AI analyzes 10,000+ successful C-suite transitions to craft your executive narrative for maximum impact and compensation.</p>
                <ul>
                  <li>7-figure compensation positioning</li>
                  <li>Board-ready executive summary</li>
                  <li>Strategic leadership storytelling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced 3D Stats Section with Glass Effect */}
      <section className="elite-section elite-stats-3d">
        <div className="elite-container">
          <div className="elite-stats-grid elite-stats-glass-effect">
            <div className="elite-stat-card elite-stat-glass-card">
              <CounterStat 
                end={500} 
                suffix="+" 
                label="Elite Executives Placed" 
                delay="0.1s" 
              />
            </div>
            
            <div className="elite-stat-card elite-stat-glass-card">
              <CounterStat 
                end={25} 
                suffix="M" 
                label="Average Compensation Increase" 
                delay="0.2s"
                prefix="£"
                isDecimal={true}
              />
            </div>
            
            <div className="elite-stat-card elite-stat-glass-card">
              <CounterStat 
                end={100} 
                suffix="%" 
                label="Confidentiality Maintained" 
                delay="0.3s" 
              />
            </div>
            
            <div className="elite-stat-card elite-stat-glass-card">
              <CounterStat 
                end={45} 
                suffix=" Days" 
                label="Average Time to Offer" 
                delay="0.4s" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Integration Icons Section */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            Seamless Integration with Executive Networks
          </h2>
          <p className="elite-section-subtitle elite-fade-in">
            Our AI connects with 500+ executive search firms, private equity networks, and board connections
          </p>
          <ExecutiveNetworkIntegration />
        </div>
      </section>

      {/* Success Stories Carousel */}
      <section className="elite-section">
        <div className="elite-container">
          <h2 className="elite-section-title elite-fade-in">
            Executive Success Stories
          </h2>
          <p className="elite-section-subtitle elite-fade-in">
            Real transformations from C-suite executives who secured their next role with complete discretion
          </p>
          <SuccessStoriesCarousel />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="elite-final-cta">
        <div className="elite-container">
          <div className="elite-fade-in">
            <h2 className="elite-final-title">
              Ready to Access the Hidden Executive Market?
            </h2>
            
            <p className="elite-final-subtitle">
              Join the elite network of executives who secure their next C-suite role
              <br />
              with complete discretion and maximum compensation.
            </p>
            
            <div className="elite-guarantees">
              <div className="elite-guarantee">
                <CheckCircle className="w-6 h-6" />
                <span>100% Confidentiality Guarantee</span>
              </div>
              <div className="elite-guarantee">
                <CheckCircle className="w-6 h-6" />
                <span>Military-Grade Encryption</span>
              </div>
              <div className="elite-guarantee">
                <CheckCircle className="w-6 h-6" />
                <span>Board-Level NDAs</span>
              </div>
            </div>
            
            <button
              className="elite-final-cta-button"
              onClick={() => handlePayment(selectedPlan)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Secure Your Elite Access'}
              <Crown className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EliteExecutive; 