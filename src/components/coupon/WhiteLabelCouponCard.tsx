import React from "react";
import { cn } from "@/lib/utils";

interface Coupon {
  id: string;
  title: string;
  description: string;
  image: string;
  expiresAt: string;
  category?: string;
  value: number;
  reason?: string;
  isPersonalized?: boolean;
}

interface CouponCardProps {
  coupon: Coupon;
  className?: string;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, className }) => {
  // Clean value display (Disney+ style - no decimals)
  const displayValue = coupon?.value >= 1 
    ? `$${Math.round(coupon.value)}` 
    : `${Math.round(coupon.value * 100)}¢`;

  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden h-full w-full",
        // Disney+ floating card depth
        "shadow-2xl shadow-black/60",
        className
      )}
      data-coupon-id={coupon?.id}
      data-coupon-value={coupon?.value.toFixed(2)}
    >
      {/* FULL-BLEED PRODUCT IMAGE */}
      <img
        src={coupon?.image}
        alt={coupon?.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* 
        DISNEY+ GRADIENT - The Secret Sauce!
        Solid black at bottom → smooth 5-stop fade to transparent
      */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.85) 20%,
            rgba(0, 0, 0, 0.6) 40%,
            rgba(0, 0, 0, 0.3) 60%,
            transparent 80%
          )`
        }}
      />
      
      {/* TEXT OVERLAY - Disney+ poster style - TV READABLE */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10">
        {/* HERO: Discount Amount - HUGE for TV */}
        <div className="flex items-baseline gap-4 mb-3">
          <h1 className="text-8xl font-black text-white leading-none tracking-tight drop-shadow-2xl">
            {displayValue}
          </h1>
          <span className="text-3xl font-bold text-white/90 uppercase tracking-wide drop-shadow-lg">
            OFF
          </span>
        </div>
        
        {/* Product Name - Larger for TV */}
        <h2 className="text-2xl font-bold text-white/95 leading-snug mb-4 drop-shadow-lg">
          {coupon?.description}
        </h2>
        
        {/* Metadata - Larger badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-lg border-2 border-white/50 text-base font-bold text-white backdrop-blur-sm">
            EXPIRES TODAY
          </div>
          
          {coupon?.reason && (
            <span className="text-base font-semibold text-white/80">
              • {coupon.reason}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
