// Enhanced CouponSwiper.tsx with real H-E-B coupon data
import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { personalizationService } from "../services/PersonalizationService";
import { analyticsService } from "../services/AnalyticsService";
import { Coupon, CouponSwiperProps } from "./coupon/types";
import CouponCard from "./coupon/WhiteLabelCouponCard";
import SwipeControls from "./coupon/WhiteLabelSwipeControls";
import RecoverButton from "./coupon/RecoverButton";
import SwipeDirectionOverlay from "./coupon/SwipeDirectionOverlay";
import EmptyState from "./coupon/EmptyState";
import hebCoupons from "@/data/hebCoupons";

const CouponSwiper = ({ onCouponSwiped, userId = "user123" }: CouponSwiperProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // 🎨 START WITH REAL H-E-B COUPONS
  const [coupons, setCoupons] = useState<Coupon[]>(hebCoupons);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<string | null>(null);
  const [discardedCoupons, setDiscardedCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cardViewStartTime, setCardViewStartTime] = useState<number>(Date.now());

  const currentCoupon = coupons[currentIndex];

  // Bumble-style swipe physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]); // More dramatic rotation like Bumble
  const bgOpacityLeft = useTransform(x, [-200, -50, 0], [0.8, 0, 0]);
  const bgOpacityRight = useTransform(x, [0, 50, 200], [0, 0, 0.8]);

  // Track when a new coupon comes into view
  useEffect(() => {
    if (currentCoupon) {
      const startTime = Date.now();
      setCardViewStartTime(startTime);
      
      // Start tracking coupon view
      analyticsService.startCouponView(currentCoupon, 'swipe', currentIndex);
    }
  }, [currentCoupon, currentIndex]);

  // Track drag progress for hesitation analytics
  useEffect(() => {
    const unsubscribe = x.onChange((value) => {
      // Track hesitation when user drags but doesn't commit to swipe
      if (Math.abs(value) > 20 && Math.abs(value) < 80) {
        analyticsService.trackHesitation();
      }
    });

    return unsubscribe;
  }, [x]);

  // Load personalized coupons and append them to H-E-B coupons (show H-E-B coupons first)
  useEffect(() => {
    const loadPersonalizedCoupons = async () => {
      setIsLoading(true);
      try {
        const personalizedCoupons = await personalizationService.getPersonalizedCoupons(userId);
        
        if (personalizedCoupons.length > 0) {
          const newCoupons = personalizedCoupons.map((pc: any) => ({
            id: pc.id,
            title: pc.title,
            description: pc.description,
            image: pc.image,
            expiresAt: pc.expiresAt,
            category: pc.category,
            value: pc.value,
            reason: pc.reason,
            isPersonalized: true,
            aiGenerated: pc.aiGenerated,
            conversionProbability: pc.conversionProbability,
            brandId: pc.brandId,
            campaignId: pc.campaignId,
          }));
          
          // Append personalized coupons AFTER H-E-B coupons (so H-E-B shows first)
          setCoupons(prevCoupons => [...hebCoupons, ...newCoupons]);
          
          const aiGeneratedCount = newCoupons.filter((c: any) => c.aiGenerated).length;
          
          toast({
            title: "Personalized Coupons",
            description: `${newCoupons.length} personalized coupons added to your ${hebCoupons.length} H-E-B deals${aiGeneratedCount > 0 ? `, including ${aiGeneratedCount} AI-generated offers` : ''}.`,
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

  // Haptic feedback for mobile devices
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 25,
        heavy: 50
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const handleSwipe = async (swipeDirection: string, method: 'gesture' | 'button' = 'button') => {
    if (coupons.length <= 1) return;
    
    // Trigger haptic feedback
    triggerHaptic('medium');
    
    setDirection(swipeDirection);
    const couponToRemove = currentCoupon;
    
    if (!couponToRemove) return;

    // Calculate drag info for analytics
    const dragInfo = {
      distance: Math.abs(x.get()),
      velocity: Math.abs(x.getVelocity()),
    };

    // Track the swipe with comprehensive analytics
    await analyticsService.trackSwipe(
      couponToRemove, 
      swipeDirection as 'left' | 'right', 
      method,
      dragInfo
    );
    
    if (onCouponSwiped) {
      onCouponSwiped(couponToRemove.id, swipeDirection);
    } else {
      if (swipeDirection === "left") {
        setDiscardedCoupons(prev => [...prev, couponToRemove]);
        
        // Show analytics feedback for declined personalized offers
        if (couponToRemove.isPersonalized) {
          toast({
            title: "Feedback Received",
            description: "We'll improve your recommendations based on this choice.",
            duration: 2000,
          });
        }
      } else if (swipeDirection === "right") {
        toast({
          title: "Coupon Saved",
          description: `${couponToRemove.title} saved to your wallet.`,
        });
        
        if (couponToRemove.aiGenerated) {
          setTimeout(() => {
            toast({
              title: "AI-Generated Offer",
              description: `This personalized offer was created based on your shopping patterns. Confidence: ${Math.round((couponToRemove.conversionProbability || 0) * 100)}%`,
            });
          }, 1000);
        }
      }
    }
    
    setTimeout(() => {
      setCoupons((prev) => prev.filter((_, i) => i !== currentIndex));
      setDirection(null);
      x.set(0);
    }, 200);
  };

  const handleDragEnd = async (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Bumble-style swipe thresholds
    const SWIPE_THRESHOLD = 100;     // px
    const VELOCITY_THRESHOLD = 0.5;  // px/ms
    
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;
    
    // Swipe right if threshold exceeded or fast velocity
    if (offset > SWIPE_THRESHOLD || (offset > 50 && velocity > VELOCITY_THRESHOLD * 1000)) {
      await handleSwipe("right", "gesture");
    } 
    // Swipe left if threshold exceeded or fast velocity
    else if (offset < -SWIPE_THRESHOLD || (offset < -50 && velocity > VELOCITY_THRESHOLD * 1000)) {
      await handleSwipe("left", "gesture");
    } else {
      // Light haptic if swipe didn't commit
      triggerHaptic('light');
    }
  };

  const handleRecoverLastCoupon = () => {
    if (discardedCoupons.length === 0) return;
    
    const lastDiscarded = discardedCoupons[discardedCoupons.length - 1];
    setCoupons(prev => [lastDiscarded, ...prev]);
    setDiscardedCoupons(prev => prev.slice(0, -1));
    
    // Track recovery action
    console.log('Coupon recovered:', lastDiscarded.id);
  };

  // Mouse hover tracking for hesitation analytics
  const handleCardHover = () => {
    analyticsService.trackHesitation();
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-280px)] min-h-[500px] flex items-center justify-center mt-2 mb-4 px-4">
      {discardedCoupons.length > 0 && (
        <RecoverButton onRecover={handleRecoverLastCoupon} />
      )}
      
      {isLoading || coupons.length === 0 ? (
        <EmptyState isLoading={isLoading} />
      ) : (
        <AnimatePresence>
          <motion.div
            key={currentCoupon?.id}
            className="absolute rounded-3xl shadow-2xl w-full overflow-hidden"
            style={{ 
              height: "calc(100vh - 300px)",
              minHeight: "480px",
              maxHeight: "650px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              x,
              rotate,
            }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: 0,
              x: direction === "left" ? -400 : direction === "right" ? 400 : 0,
              rotate: direction === "left" ? -45 : direction === "right" ? 45 : 0,
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              mass: 1
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleCardHover}
            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
            dragElastic={0.2}
          >
            <SwipeDirectionOverlay 
              bgOpacityLeft={bgOpacityLeft}
              bgOpacityRight={bgOpacityRight}
              isPersonalized={currentCoupon?.isPersonalized}
              isAiGenerated={currentCoupon?.aiGenerated}
            />
            
            <CouponCard coupon={currentCoupon} />
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Swipe-only interface - no button controls */}

      {/* Analytics Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Real H-E-B Coupons: {hebCoupons.length}</div>
          <div>Current: {currentIndex + 1}/{coupons.length}</div>
          <div>Remaining: {coupons.length - currentIndex}</div>
        </div>
      )}
    </div>
  );
};

export default CouponSwiper;