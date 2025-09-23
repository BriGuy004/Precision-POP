
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  
  // Handle page transitions
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <main className="flex-1 px-4 pb-12 pt-0 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div 
          className={`transition-opacity duration-300 ${
            isPageTransitioning ? "opacity-0" : "opacity-100 animate-scale-in"
          }`}
        >
          {children}
        </div>
      </main>
      
      {/* Navigation is fixed at the bottom for mobile-first design */}
      <Navigation />
    </div>
  );
};

export default Layout;
