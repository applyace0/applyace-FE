import React, { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingCard } from "@/components/ui/3d-card";
import { AnimatedCounter } from "@/components/ui/counter";

interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'interviewing' | 'rejected' | 'accepted';
  salary: string;
  type: string;
  logo?: string;
  matchScore: number;
}

const mockJobApplications: JobApplication[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'London, UK',
    appliedDate: '2025-01-20',
    status: 'interviewing',
    salary: '£70,000 - £90,000',
    type: 'Full-time',
    matchScore: 95,
  },
  {
    id: '2',
    title: 'React Developer',
    company: 'StartupXYZ',
    location: 'Manchester, UK',
    appliedDate: '2025-01-18',
    status: 'pending',
    salary: '£50,000 - £65,000',
    type: 'Full-time',
    matchScore: 88,
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'Innovation Labs',
    location: 'Birmingham, UK',
    appliedDate: '2025-01-15',
    status: 'accepted',
    salary: '£60,000 - £80,000',
    type: 'Full-time',
    matchScore: 92,
  },
  {
    id: '4',
    title: 'JavaScript Developer',
    company: 'Digital Solutions',
    location: 'Leeds, UK',
    appliedDate: '2025-01-12',
    status: 'rejected',
    salary: '£45,000 - £60,000',
    type: 'Full-time',
    matchScore: 78,
  },
  {
    id: '5',
    title: 'UI/UX Developer',
    company: 'Creative Agency',
    location: 'Edinburgh, UK',
    appliedDate: '2025-01-10',
    status: 'pending',
    salary: '£55,000 - £70,000',
    type: 'Full-time',
    matchScore: 85,
  },
];

const getStatusConfig = (status: JobApplication['status']) => {
  switch (status) {
    case 'pending':
      return {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Under Review',
        glow: 'glow-yellow'
      };
    case 'interviewing':
      return {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Interviewing',
        glow: 'glow-blue'
      };
    case 'accepted':
      return {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Accepted',
        glow: 'glow-green'
      };
    case 'rejected':
      return {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Not Selected',
        glow: 'glow-red'
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export const JobsAppliedCarousel: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mouse wheel handler
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!api) return;
    
    event.preventDefault();
    
    if (event.deltaY > 0) {
      api.scrollNext();
    } else {
      api.scrollPrev();
    }
  }, [api]);

  // Set up carousel API and wheel listener
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Add wheel event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      carousel.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className="space-y-6" ref={carouselRef}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="p-2 bg-blue-100 rounded-lg"
          >
            <Briefcase className="h-6 w-6 text-blue-600" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
            <p className="text-gray-600">Track your job application progress</p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <FloatingCard delay={0.1}>
          <Card className="text-center card-3d glow-blue">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                <AnimatedCounter value={mockJobApplications.length} />
              </div>
              <p className="text-sm text-gray-600">Total Applied</p>
            </CardContent>
          </Card>
        </FloatingCard>
        
        <FloatingCard delay={0.2}>
          <Card className="text-center card-3d glow-yellow">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                <AnimatedCounter value={mockJobApplications.filter(j => j.status === 'pending').length} />
              </div>
              <p className="text-sm text-gray-600">Under Review</p>
            </CardContent>
          </Card>
        </FloatingCard>
        
        <FloatingCard delay={0.3}>
          <Card className="text-center card-3d glow-blue">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                <AnimatedCounter value={mockJobApplications.filter(j => j.status === 'interviewing').length} />
              </div>
              <p className="text-sm text-gray-600">Interviewing</p>
            </CardContent>
          </Card>
        </FloatingCard>
        
        <FloatingCard delay={0.4}>
          <Card className="text-center card-3d glow-green">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                <AnimatedCounter value={mockJobApplications.filter(j => j.status === 'accepted').length} />
              </div>
              <p className="text-sm text-gray-600">Accepted</p>
            </CardContent>
          </Card>
        </FloatingCard>
      </motion.div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="perspective-2000"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          borderRadius: '24px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: "trimSnaps",
            slidesToScroll: 1,
          }}
          className="w-full transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {mockJobApplications.map((job, index) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <CarouselItem key={job.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotateY: -15 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.08, 
                      rotateY: 8, 
                      rotateX: 8,
                      z: 80,
                      transition: { duration: 0.4, type: "spring", stiffness: 300 }
                    }}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                    className="h-full"
                  >
                    <Card className={`h-full card-3d ${statusConfig.glow} transition-all duration-500 hover:shadow-2xl transform-gpu`}
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                              {job.title}
                            </CardTitle>
                            <div className="flex items-center text-gray-600 mt-1">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                <Building2 className="h-4 w-4 mr-2" />
                              </motion.div>
                              <span className="text-sm">{job.company}</span>
                            </div>
                          </div>
                          <Badge className={`${statusConfig.color} border`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">Applied {formatDate(job.appliedDate)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{job.salary}</span>
                            <motion.div
                              className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                              whileHover={{ scale: 1.05 }}
                            >
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                              </motion.div>
                              <AnimatedCounter value={job.matchScore} suffix="%" className="text-xs font-medium" />
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {/* Enhanced Navigation Buttons */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-lg z-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-lg z-10" />
        </Carousel>

        {/* Scroll Indicator */}
        {count > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-6 space-x-2"
          >
            {Array.from({ length: count }).map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index + 1 === current 
                    ? 'bg-blue-500 w-8 shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => api?.scrollTo(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        )}

        {/* Mouse Wheel Hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-center mt-4"
        >
          <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🖱️
            </motion.span>
            <span>Use mouse wheel to navigate</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 