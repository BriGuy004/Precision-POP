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

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
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

  const handleSwipe = async (swipeDirection: string, method: 'gesture' | 'button' = 'button') => {
    if (coupons.length <= 1) return;
    
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
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      await handleSwipe("right", "gesture");
    } else if (info.offset.x < -swipeThreshold) {
      await handleSwipe("left", "gesture");
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
    <div className="relative w-full max-w-xs mx-auto h-[50vh] flex items-center justify-center mt-6 mb-24">
      {discardedCoupons.length > 0 && (
        <RecoverButton onRecover={handleRecoverLastCoupon} />
      )}
      
      {isLoading || coupons.length === 0 ? (
        <EmptyState isLoading={isLoading} />
      ) : (
        <AnimatePresence>
          <motion.div
            key={currentCoupon?.id}
            className="absolute glass-card p-3 rounded-2xl shadow-2xl shadow-black/40 dark:shadow-black/60 w-full max-w-xs"
            style={{ 
              height: "400px", 
              maxHeight: "50vh",
              boxShadow: "0 -8px 20px -4px rgba(0,0,0,0.2), 0 8px 20px -4px rgba(0,0,0,0.3)",
              x,
              rotate,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
              rotate: direction === "left" ? -30 : direction === "right" ? 30 : 0,
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0,
              transition: { duration: 0.3 }
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              mass: 0.8
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleCardHover}
            whileDrag={{ scale: 1.05 }}
            dragElastic={0.15}
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
      
      {coupons.length > 0 && (
        <SwipeControls 
          onSwipeLeft={() => handleSwipe("left", "button")}
          onSwipeRight={() => handleSwipe("right", "button")}
          isPersonalized={currentCoupon?.isPersonalized}
          isAiGenerated={currentCoupon?.aiGenerated}
        />
      )}

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