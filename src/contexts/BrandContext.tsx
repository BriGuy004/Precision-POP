import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Brand {
  id: string;
  retailer_id: string;
  name: string;
  logo_url: string;
  hero_image_url: string;
  primary_color: string;
  accent_color: string;
  city?: string;
  state?: string;
  website?: string;
  description?: string;
  is_active: boolean;
}

interface BrandContextType {
  currentBrand: Brand | null;
  allBrands: Brand[];
  setActiveBrand: (retailerId: string) => Promise<void>;
  isLoading: boolean;
  isSwitchingBrand: boolean;
  refreshBrands: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingBrand, setIsSwitchingBrand] = useState(false);

  const fetchBrands = async () => {
    try {
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
        hero_image_url: retailer.hero_image_url,
        primary_color: retailer.primary_color || '142 71% 45%',
        accent_color: retailer.accent_color || '25 95% 53%',
        city: retailer.city,
        state: retailer.state,
        website: retailer.website,
        description: retailer.description,
        is_active: retailer.is_active || false,
      }));

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
    root.style.setProperty('--brand-accent', brand.accent_color);
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

  return (
    <BrandContext.Provider
      value={{
        currentBrand,
        allBrands,
        setActiveBrand,
        isLoading,
        isSwitchingBrand,
        refreshBrands,
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
