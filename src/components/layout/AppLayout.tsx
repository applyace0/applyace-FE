import { TopNavigation } from '@/components/navigation/TopNavigation';
import { useEffect, useRef, useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  showTopNav?: boolean;
}

// Global Purple Mouse Follower Component
const GlobalMouseFollower = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const trail: HTMLDivElement[] = [];
    
    // Create trail elements
    for (let i = 0; i < 8; i++) {
      const trailElement = document.createElement('div');
      trailElement.className = 'global-mouse-trail';
      trailElement.style.opacity = String((8 - i) / 12);
      document.body.appendChild(trailElement);
      trail.push(trailElement);
    }
    
    trailRef.current = trail;

    let mouseX = 0;
    let mouseY = 0;
    const trailPositions: { x: number; y: number }[] = Array(8).fill({ x: 0, y: 0 });

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const updateTrail = () => {
      // Update trail positions
      trailPositions.unshift({ x: mouseX, y: mouseY });
      trailPositions.pop();

      // Apply positions to trail elements
      trail.forEach((element, index) => {
        const position = trailPositions[index];
        if (position) {
          element.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }
      });

      requestAnimationFrame(updateTrail);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updateCursor);
    
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea, select');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    updateTrail();

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      trail.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`global-cursor-dot ${isHovering ? 'hovering' : ''}`}
    />
  );
};

export function AppLayout({ children, showTopNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalMouseFollower />
      {showTopNav && <TopNavigation />}
      <main className={showTopNav ? "pt-0" : ""}>
        {children}
      </main>
    </div>
  );
} 