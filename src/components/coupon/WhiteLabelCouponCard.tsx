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
  brand?: string;
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
      
      {/* TEXT OVERLAY - Bumble style: minimal, clean, TV READABLE from 10ft */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
        {/* HERO: Discount Amount - MASSIVE for TV visibility */}
        <div className="flex items-baseline gap-4 mb-4">
          <h1 className="text-[7rem] font-black text-white leading-none tracking-tight drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            {displayValue}
          </h1>
          <span className="text-4xl font-bold text-white/95 uppercase tracking-wider drop-shadow-lg">
            OFF
          </span>
        </div>
        
        {/* Product Name - Bold, clear */}
        <h2 className="text-3xl font-bold text-white leading-tight mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
          {coupon?.title}
        </h2>
        
        {/* Brand + Expiry - Clean badges */}
        <div className="flex items-center gap-3 flex-wrap">
          {coupon?.brand && (
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-lg font-bold text-white">
              {coupon.brand}
            </div>
          )}
          <div className="px-4 py-2 rounded-full bg-red-500/80 backdrop-blur-md text-lg font-bold text-white">
            EXPIRES SOON
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
