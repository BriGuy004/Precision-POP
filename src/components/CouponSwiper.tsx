import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, animate } from "framer-motion";
import { MapPin, RotateCcw } from "lucide-react";
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

// Demo store location
const DEMO_STORE = {
  name: "H-E-B Mueller",
  address: "Austin, TX",
};

const CouponSwiper = ({ onCouponSwiped, userId = "user123" }: CouponSwiperProps) => {
  const { toast } = useToast();
  const { retailer } = useRetailer();
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [savedCoupons, setSavedCoupons] = useState<Coupon[]>([]);
  const [discardedCoupons, setDiscardedCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);

  const currentCoupon = coupons[currentIndex];
  
  // Fetch coupons with guaranteed fallback
  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      setCoupons(hebCoupons); // Always start with cached
      
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
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
        }
      } catch (error) {
        console.error('Using cached coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoupons();
  }, []);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
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
      try {
        const personalizedCoupons = await personalizationService.getPersonalizedCoupons(userId);
        if (personalizedCoupons.length > 0) {
          setCoupons(prev => [...prev, ...personalizedCoupons.map((pc: any) => ({ ...pc, isPersonalized: true }))]);
        }
      } catch (error) {
        console.error("Error loading personalized coupons:", error);
      }
    };
    loadPersonalizedCoupons();
  }, [userId]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      navigator.vibrate({ light: 10, medium: 25, heavy: 50 }[type]);
    }
  };

  const handleSwipe = async (swipeDirection: string, method: 'gesture' | 'button' = 'gesture') => {
    if (!currentCoupon || isSwiping) return;
    
    setIsSwiping(true);
    triggerHaptic('medium');
    setDirection(swipeDirection);
    
    const exitX = swipeDirection === 'right' ? 500 : -500;
    await animate(x, exitX, { type: "spring", stiffness: 300, damping: 30 });
    
    analyticsService.trackSwipe(
      currentCoupon, 
      swipeDirection as 'left' | 'right', 
      method,
      { distance: Math.abs(x.get()), velocity: Math.abs(x.getVelocity()) }
    );
    
    if (onCouponSwiped) {
      onCouponSwiped(currentCoupon.id, swipeDirection);
    } else {
      if (swipeDirection === "left") {
        setDiscardedCoupons(prev => [...prev, currentCoupon]);
      } else if (swipeDirection === "right") {
        setSavedCoupons(prev => [...prev, currentCoupon]);
        toast({
          title: "✓ SAVED!",
          description: `${currentCoupon.title} added to wallet`,
          duration: 2000,
        });
      }
    }
    
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
  };

  const totalSavings = calculateTotalSavings();

  return (
    <div className="fixed inset-0 bg-black">
      {/* ===== BUMBLE-STYLE: FULL-BLEED CARD ===== */}
      <div className="absolute inset-0">
        {isLoading || coupons.length === 0 ? (
          <EmptyState isLoading={isLoading} />
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {currentCoupon && (
              <motion.div
                key={currentCoupon.id}
                className="absolute inset-0"
                style={{ x, rotate }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
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

      {/* ===== FLOATING UI - MINIMAL CHROME ===== */}
      
      {/* Top: Check-in pill (subtle, floating) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-[calc(env(safe-area-inset-top,1rem)+0.75rem)] left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-2 px-4 py-2 
                        bg-black/40 backdrop-blur-xl rounded-full
                        border border-white/10 shadow-2xl">
          <MapPin className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-white">
            {DEMO_STORE.name}
          </span>
        </div>
      </motion.div>

      {/* Top-right: Savings counter (only show if savings > 0) */}
      <AnimatePresence>
        {totalSavings > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-[calc(env(safe-area-inset-top,1rem)+0.75rem)] right-4 z-50"
          >
            <div className="px-4 py-2 bg-green-500 rounded-full shadow-2xl">
              <span className="text-xl font-black text-white tabular-nums">
                ${totalSavings.toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-left: Undo button (only show if there are discarded coupons) */}
      <AnimatePresence>
        {discardedCoupons.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRecoverLastCoupon}
            className="absolute top-[calc(env(safe-area-inset-top,1rem)+0.75rem)] left-4 z-50
                       w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl
                       border border-white/10 shadow-2xl
                       flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom: Subtle swipe hint (fades after first card) */}
      {currentIndex === 0 && coupons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-[calc(env(safe-area-inset-bottom,1rem)+2rem)] 
                     left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-6 text-white/70"
          >
            <span className="text-sm font-medium">← Skip</span>
            <div className="w-12 h-1 bg-white/30 rounded-full" />
            <span className="text-sm font-medium">Save →</span>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom: Card counter (subtle) */}
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom,1rem)+0.5rem)] 
                      left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <span className="text-xs font-medium text-white/40 tabular-nums">
          {coupons.length > 0 ? `${coupons.length} deals left` : ''}
        </span>
      </div>
    </div>
  );
};

export default CouponSwiper;
