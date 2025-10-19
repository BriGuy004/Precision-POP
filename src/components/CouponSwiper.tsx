import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ShoppingCart, Undo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRetailer } from "@/contexts/RetailerContext";
import { personalizationService } from "../services/PersonalizationService";
import { analyticsService } from "../services/AnalyticsService";
import { Coupon, CouponSwiperProps } from "./coupon/types";
import CouponCard from "./coupon/WhiteLabelCouponCard";
import SwipeDirectionOverlay from "./coupon/SwipeDirectionOverlay";
import EmptyState from "./coupon/EmptyState";
import hebCoupons from "@/data/hebCoupons";

const CouponSwiper = ({ onCouponSwiped, userId = "user123" }: CouponSwiperProps) => {
  const { toast } = useToast();
  const { retailer } = useRetailer();
  
  const [coupons, setCoupons] = useState<Coupon[]>(hebCoupons);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [savedCoupons, setSavedCoupons] = useState<Coupon[]>([]);
  const [discardedCoupons, setDiscardedCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentCoupon = coupons[currentIndex];

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
          
          toast({
            title: "Personalized Offers",
            description: `${newCoupons.length} personalized coupons added!`,
          });
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
    if (!currentCoupon) return;
    
    triggerHaptic('medium');
    setDirection(swipeDirection);
    
    const dragInfo = {
      distance: Math.abs(x.get()),
      velocity: Math.abs(x.getVelocity()),
    };

    await analyticsService.trackSwipe(
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
    
    setTimeout(() => {
      setCoupons(prev => prev.filter((_, i) => i !== currentIndex));
      setDirection(null);
      x.set(0);
    }, 200);
  };

  const handleDragEnd = async (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const SWIPE_THRESHOLD = 100;
    const VELOCITY_THRESHOLD = 0.5;
    
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;
    
    if (offset > SWIPE_THRESHOLD || (offset > 50 && velocity > VELOCITY_THRESHOLD * 1000)) {
      await handleSwipe("right", "gesture");
    } else if (offset < -SWIPE_THRESHOLD || (offset < -50 && velocity > VELOCITY_THRESHOLD * 1000)) {
      await handleSwipe("left", "gesture");
    } else {
      triggerHaptic('light');
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
          <AnimatePresence mode="wait" initial={false}>
            {currentCoupon && (
              <motion.div
                key={currentCoupon.id}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ x, rotate }}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0,
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  x: direction === "left" ? -400 : direction === "right" ? 400 : 0,
                  rotate: direction === "left" ? -45 : direction === "right" ? 45 : 0,
                  transition: { duration: 0.3 }
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
                dragElastic={0.2}
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
