import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, animate } from "framer-motion";
import { ShoppingCart, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRetailer } from "@/contexts/BrandContext";
import { supabase } from "@/integrations/supabase/client";
import { personalizationService } from "../services/PersonalizationService";
import { analyticsService } from "../services/AnalyticsService";
import { Coupon, CouponSwiperProps } from "./coupon/types";
import CouponCard from "./coupon/WhiteLabelCouponCard";
import SwipeDirectionOverlay from "./coupon/SwipeDirectionOverlay";
import EmptyState from "./coupon/EmptyState";
import hebCoupons from "@/data/hebCoupons";

const CouponSwiper = ({ onCouponSwiped, userId = "user123" }: CouponSwiperProps) => {
  const { toast } = useToast();
  const { retailer, retailerId } = useRetailer();
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [savedCoupons, setSavedCoupons] = useState<Coupon[]>([]);
  const [discardedCoupons, setDiscardedCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);

  const currentCoupon = coupons[currentIndex];
  
  // Fetch coupons from Supabase
  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform Supabase data to match Coupon type
          const transformedCoupons: Coupon[] = data.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            image: c.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
            value: c.value,
            expiresAt: c.expiration || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            category: c.category,
            brand: c.brand,
          }));
          setCoupons(transformedCoupons);
        } else {
          // Fallback to hardcoded coupons if no data in Supabase
          setCoupons(hebCoupons);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
        // Fallback to hardcoded coupons on error
        setCoupons(hebCoupons);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoupons();
  }, [retailerId]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const bgOpacityLeft = useTransform(x, [-200, -50, 0], [0.8, 0, 0]);
  const bgOpacityRight = useTransform(x, [0, 50, 200], [0, 0, 0.8]);

  const calculateTotalSavings = () => {
    return savedCoupons.reduce((total, coupon) => total + coupon.value, 0);
  };

  useEffect(() => {
    if (currentCoupon) {
      analyticsService.startCouponView(currentCoupon, 'swipe', currentIndex);
    }
  }, [currentCoupon, currentIndex]);

  useEffect(() => {
    const loadPersonalizedCoupons = async () => {
      setIsLoading(true);
      try {
        const personalizedCoupons = await personalizationService.getPersonalizedCoupons(userId);
        
        if (personalizedCoupons.length > 0) {
          const newCoupons = personalizedCoupons.map((pc: any) => ({
            ...pc,
            isPersonalized: true,
          }));
          
          setCoupons(prev => [...prev, ...newCoupons]);
        }
      } catch (error) {
        console.error("Error loading personalized coupons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPersonalizedCoupons();
  }, [userId, toast]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleSwipe = async (swipeDirection: string, method: 'gesture' | 'button' = 'gesture') => {
    if (!currentCoupon || isSwiping) return;
    
    setIsSwiping(true);
    triggerHaptic('medium');
    setDirection(swipeDirection);
    
    // Animate card off screen
    const exitX = swipeDirection === 'right' ? 500 : -500;
    await animate(x, exitX, { type: "spring", stiffness: 300, damping: 30 });
    
    const dragInfo = {
      distance: Math.abs(x.get()),
      velocity: Math.abs(x.getVelocity()),
    };

    analyticsService.trackSwipe(
      currentCoupon, 
      swipeDirection as 'left' | 'right', 
      method,
      dragInfo
    );
    
    if (onCouponSwiped) {
      onCouponSwiped(currentCoupon.id, swipeDirection);
    } else {
      if (swipeDirection === "left") {
        setDiscardedCoupons(prev => [...prev, currentCoupon]);
      } else if (swipeDirection === "right") {
        setSavedCoupons(prev => [...prev, currentCoupon]);
        
        toast({
          title: "Saved!",
          description: `${currentCoupon.title} added to your wallet.`,
          duration: 2000,
        });
      }
    }
    
    // Remove card and reset for next
    setCoupons(prev => prev.filter((_, i) => i !== currentIndex));
    setDirection(null);
    x.set(0);
    setIsSwiping(false);
  };

  const handleDragEnd = async (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isSwiping) return;
    
    const SWIPE_THRESHOLD = 100;
    const VELOCITY_THRESHOLD = 500;
    
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;
    
    if (offset > SWIPE_THRESHOLD || (offset > 50 && velocity > VELOCITY_THRESHOLD)) {
      await handleSwipe("right", "gesture");
    } else if (offset < -SWIPE_THRESHOLD || (offset < -50 && velocity > VELOCITY_THRESHOLD)) {
      await handleSwipe("left", "gesture");
    } else {
      // Spring back to center with smooth animation
      triggerHaptic('light');
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  const handleRecoverLastCoupon = () => {
    if (discardedCoupons.length === 0) return;
    
    const lastDiscarded = discardedCoupons[discardedCoupons.length - 1];
    setCoupons(prev => [lastDiscarded, ...prev]);
    setDiscardedCoupons(prev => prev.slice(0, -1));
    
    triggerHaptic('light');
    toast({
      title: "Recovered!",
      description: "Coupon added back to queue",
      duration: 2000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* CLEAN TOP BAR - Bumble/Disney+ style */}
      <div className="absolute top-0 left-0 right-0 z-50 
                      bg-gradient-to-b from-black/90 via-black/70 to-transparent 
                      pt-[env(safe-area-inset-top,1rem)]">
        <div className="flex items-center justify-between px-5 py-4">
          {/* Retailer Logo with fallback */}
          {retailer?.logo ? (
            <img 
              src={retailer.logo} 
              alt={retailer.name || 'Store'}
              className="h-10 w-auto drop-shadow-2xl"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md 
                            flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {retailer?.shortName?.[0] || 'S'}
              </span>
            </div>
          )}
          
          {/* Undo Button (conditional) */}
          {discardedCoupons.length > 0 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRecoverLastCoupon}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md 
                         flex items-center justify-center shadow-lg 
                         active:bg-white/20 transition-colors"
            >
              <Undo2 className="w-5 h-5 text-white" />
            </motion.button>
          )}
          
          {/* Savings Counter */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-white/10 backdrop-blur-md shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white tabular-nums">
              ${calculateTotalSavings().toFixed(2)}
            </span>
          </motion.div>
        </div>
      </div>
      
      {/* CARD AREA - Full screen, single card */}
      <div className="absolute 
                      top-24 
                      bottom-[calc(2rem+env(safe-area-inset-bottom,0px))]
                      left-6 
                      right-6">
        {isLoading || coupons.length === 0 ? (
          <EmptyState isLoading={isLoading} />
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {currentCoupon && (
              <motion.div
                key={currentCoupon.id}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ x, rotate }}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0,
                }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.1 }
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 35
                }}
                drag="x"
                dragConstraints={{ left: -300, right: 300 }}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                dragElastic={0.9}
              >
                <SwipeDirectionOverlay 
                  bgOpacityLeft={bgOpacityLeft}
                  bgOpacityRight={bgOpacityRight}
                  isPersonalized={currentCoupon.isPersonalized}
                  isAiGenerated={currentCoupon.aiGenerated}
                />
                
                <CouponCard coupon={currentCoupon} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* FIRST-TIME USER HINT */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 
                     px-5 py-2 bg-black/60 backdrop-blur-md rounded-full z-40
                     pointer-events-none"
        >
          <p className="text-sm text-white font-medium">
            Swipe to save or skip
          </p>
        </motion.div>
      )}

      {/* DEBUG PANEL */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed 
                     bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]
                     left-4 right-4 
                     bg-black/90 backdrop-blur-md text-white p-3 rounded-xl 
                     text-xs border border-white/10 shadow-2xl font-mono 
                     max-w-sm mx-auto"
        >
          <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
            <span className="text-white/60">DEBUG</span>
            <span className="text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/60">Card:</span>
              <span className="text-white font-bold">{currentIndex + 1}/{coupons.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Saved:</span>
              <span className="text-green-400 font-bold">${calculateTotalSavings().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Drag:</span>
              <span className="text-blue-400 font-bold">{Math.round(x.get())}px</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CouponSwiper;
