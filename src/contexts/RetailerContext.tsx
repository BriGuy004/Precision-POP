// src/contexts/RetailerContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentRetailer, getCurrentRetailerId, RETAILERS, type RetailerConfig, type RetailerId } from '@/config/retailers';

interface RetailerContextType {
  retailer: RetailerConfig;
  retailerId: RetailerId;
  switchRetailer: (retailerId: RetailerId) => void;
  allRetailers: typeof RETAILERS;
}

const RetailerContext = createContext<RetailerContextType | undefined>(undefined);

export const RetailerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [retailerId, setRetailerId] = useState<RetailerId>(getCurrentRetailerId());
  const [retailer, setRetailer] = useState<RetailerConfig>(getCurrentRetailer());

  // Update CSS variables when retailer changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties for theming
    root.style.setProperty('--color-primary', retailer.theme.primary);
    root.style.setProperty('--color-secondary', retailer.theme.secondary);
    root.style.setProperty('--color-accent', retailer.theme.accent);
    root.style.setProperty('--color-background', retailer.theme.background);
    root.style.setProperty('--color-text', retailer.theme.text);
    root.style.setProperty('--color-success', retailer.theme.success);
    root.style.setProperty('--color-error', retailer.theme.error);

    // Update document title
    document.title = `${retailer.name} - Precision POP`;

    // Update meta theme color for mobile browsers
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', retailer.theme.primary);
  }, [retailer]);

  const switchRetailer = (newRetailerId: RetailerId) => {
    localStorage.setItem('retailer_override', newRetailerId);
    setRetailerId(newRetailerId);
    setRetailer(RETAILERS[newRetailerId]);
  };

  return (
    <RetailerContext.Provider 
      value={{ 
        retailer, 
        retailerId, 
        switchRetailer,
        allRetailers: RETAILERS 
      }}
    >
      {children}
    </RetailerContext.Provider>
  );
};

export const useRetailer = () => {
  const context = useContext(RetailerContext);
  if (context === undefined) {
    throw new Error('useRetailer must be used within a RetailerProvider');
  }
  return context;
};
