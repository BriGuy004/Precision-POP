import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Brand {
  id: string;
  retailer_id: string;
  name: string;
  logo_url: string;
  primary_color: string;
  city?: string;
  state?: string;
  website?: string;
  tagline?: string;
  is_active: boolean;
}

// Backward compatibility with old RetailerContext API
interface RetailerTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  error: string;
}

interface RetailerCompat {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  theme: RetailerTheme;
  logo: string;
}

interface BrandContextType {
  currentBrand: Brand | null;
  allBrands: Brand[];
  setActiveBrand: (retailerId: string) => Promise<void>;
  isLoading: boolean;
  isSwitchingBrand: boolean;
  refreshBrands: () => Promise<void>;
  // Backward compatibility
  retailer: RetailerCompat;
  retailerId: string;
  switchRetailer: (retailerId: string) => Promise<void>;
  allRetailers: Record<string, RetailerCompat>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingBrand, setIsSwitchingBrand] = useState(false);

  const brandToRetailerCompat = (brand: Brand): RetailerCompat => ({
    id: brand.retailer_id,
    name: brand.name,
    shortName: brand.name,
    tagline: brand.tagline || 'Your Neighborhood Market',
    theme: {
      primary: `hsl(${brand.primary_color})`,
      secondary: `hsl(${brand.primary_color})`,
      accent: `hsl(${brand.primary_color})`,
      background: '#FFFFFF',
      text: '#1a1a1a',
      success: '#10b981',
      error: '#ef4444',
    },
    logo: brand.logo_url,
  });

  const fetchBrands = async () => {
    try {
      // Small delay to ensure Postgres consistency
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('name');

      if (error) throw error;

      const brands = (data || []).map(retailer => ({
        id: retailer.id,
        retailer_id: retailer.retailer_id,
        name: retailer.name,
        logo_url: retailer.logo_url,
        primary_color: retailer.primary_color || '142 71% 45%',
        city: retailer.city,
        state: retailer.state,
        website: retailer.website,
        tagline: retailer.tagline,
        is_active: retailer.is_active || false,
      }));

      console.log('✅ Fetched brands:', brands);

      setAllBrands(brands);

      const activeBrand = brands.find(b => b.is_active) || brands[0];
      if (activeBrand) {
        setCurrentBrand(activeBrand);
        applyBrandStyles(activeBrand);
      }
    } catch (error: any) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load grocery brands');
    } finally {
      setIsLoading(false);
    }
  };

  const applyBrandStyles = (brand: Brand) => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brand.primary_color);
  };

  const setActiveBrand = async (retailerId: string) => {
    setIsSwitchingBrand(true);
    try {
      // Deactivate all brands first
      await supabase
        .from('retailers')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Activate selected brand
      const { error } = await supabase
        .from('retailers')
        .update({ is_active: true })
        .eq('retailer_id', retailerId);

      if (error) throw error;

      await fetchBrands();
      toast.success('Brand switched successfully!');
    } catch (error: any) {
      console.error('Error switching brand:', error);
      toast.error('Failed to switch brand');
    } finally {
      setIsSwitchingBrand(false);
    }
  };

  const refreshBrands = async () => {
    await fetchBrands();
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Create backward-compatible retailer objects
  const retailer = currentBrand ? brandToRetailerCompat(currentBrand) : {
    id: 'demo',
    name: 'Demo Grocers',
    shortName: 'Demo',
    tagline: 'Your Neighborhood Market',
    theme: {
      primary: 'hsl(142 71% 45%)',
      secondary: 'hsl(25 95% 53%)',
      accent: 'hsl(25 95% 53%)',
      background: '#FFFFFF',
      text: '#1a1a1a',
      success: '#10b981',
      error: '#ef4444',
    },
    logo: '',
  };

  const allRetailers = allBrands.reduce((acc, brand) => {
    acc[brand.retailer_id] = brandToRetailerCompat(brand);
    return acc;
  }, {} as Record<string, RetailerCompat>);

  return (
    <BrandContext.Provider
      value={{
        currentBrand,
        allBrands,
        setActiveBrand,
        isLoading,
        isSwitchingBrand,
        refreshBrands,
        // Backward compatibility
        retailer,
        retailerId: currentBrand?.retailer_id || 'demo',
        switchRetailer: setActiveBrand,
        allRetailers,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

// Backward compatibility export
export const useRetailer = useBrand;
