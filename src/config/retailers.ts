// src/config/retailers.ts

export interface RetailerTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  error: string;
}

export interface RetailerConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  theme: RetailerTheme;
  logo: string;
  domain: string;
  features: {
    videoContent: boolean;
    bleBeacons: boolean;
    brandBidding: boolean;
  };
  contact: {
    phone: string;
    email: string;
    supportUrl: string;
  };
}

export const RETAILERS: Record<string, RetailerConfig> = {
  kroger: {
    id: 'kroger',
    name: 'Kroger',
    shortName: 'Kroger',
    tagline: 'Fresh for Everyone',
    theme: {
      primary: '#0057B8',
      secondary: '#EE3124',
      accent: '#FDB71A',
      background: '#FFFFFF',
      text: '#1a1a1a',
      success: '#10b981',
      error: '#ef4444',
    },
    logo: '/logos/kroger.svg',
    domain: 'kroger.precisionpop.app',
    features: {
      videoContent: true,
      bleBeacons: true,
      brandBidding: true,
    },
    contact: {
      phone: '1-800-KROGERS',
      email: 'support@kroger.com',
      supportUrl: 'https://www.kroger.com/hc',
    },
  },
  
  heb: {
    id: 'heb',
    name: 'H-E-B',
    shortName: 'H-E-B',
    tagline: 'Here Everything\'s Better',
    theme: {
      primary: '#C8102E',
      secondary: '#FFD700',
      accent: '#000000',
      background: '#FFFFFF',
      text: '#1a1a1a',
      success: '#10b981',
      error: '#ef4444',
    },
    logo: '/logos/heb.svg',
    domain: 'heb.precisionpop.app',
    features: {
      videoContent: true,
      bleBeacons: false, // Not yet deployed
      brandBidding: true,
    },
    contact: {
      phone: '1-800-432-3113',
      email: 'support@heb.com',
      supportUrl: 'https://www.heb.com/hc',
    },
  },

  demo: {
    id: 'demo',
    name: 'Demo Grocers',
    shortName: 'Demo',
    tagline: 'Your Neighborhood Market',
    theme: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f59e0b',
      background: '#FFFFFF',
      text: '#1a1a1a',
      success: '#10b981',
      error: '#ef4444',
    },
    logo: '/logos/demo.svg',
    domain: 'demo.precisionpop.app',
    features: {
      videoContent: true,
      bleBeacons: true,
      brandBidding: true,
    },
    contact: {
      phone: '1-800-DEMO-123',
      email: 'hello@demogrocers.com',
      supportUrl: 'https://demo.precisionpop.app/support',
    },
  },
};

export type RetailerId = keyof typeof RETAILERS;

/**
 * Detects which retailer to use based on:
 * 1. URL subdomain (kroger.precisionpop.app)
 * 2. Environment variable (VITE_RETAILER_ID)
 * 3. localStorage override (for testing)
 * 4. Default to 'demo'
 */
export const getCurrentRetailerId = (): RetailerId => {
  // Check localStorage first (for easy testing)
  const localOverride = localStorage.getItem('retailer_override');
  if (localOverride && localOverride in RETAILERS) {
    return localOverride as RetailerId;
  }

  // Check environment variable
  const envRetailer = import.meta.env.VITE_RETAILER_ID;
  if (envRetailer && envRetailer in RETAILERS) {
    return envRetailer as RetailerId;
  }

  // Check subdomain
  const hostname = window.location.hostname;
  for (const retailerId of Object.keys(RETAILERS)) {
    if (hostname.includes(retailerId)) {
      return retailerId as RetailerId;
    }
  }

  // Default to demo
  return 'demo';
};

export const getCurrentRetailer = (): RetailerConfig => {
  const retailerId = getCurrentRetailerId();
  return RETAILERS[retailerId];
};

// Helper function for testing - switch retailer without redeploying
export const setRetailerOverride = (retailerId: RetailerId) => {
  localStorage.setItem('retailer_override', retailerId);
  window.location.reload();
};

export const clearRetailerOverride = () => {
  localStorage.removeItem('retailer_override');
  window.location.reload();
};
