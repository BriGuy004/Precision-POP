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
  // Clean value display - prominent savings amount
  const displayValue = coupon?.value >= 1 
    ? `$${Math.round(coupon.value)}` 
    : `${Math.round(coupon.value * 100)}¢`;

  return (
    <div 
      className={cn(
        "relative w-full h-full overflow-hidden",
        className
      )}
      data-coupon-id={coupon?.id}
      data-coupon-value={coupon?.value.toFixed(2)}
    >
      {/* ===== FULL-BLEED PRODUCT IMAGE ===== */}
      <img
        src={coupon?.image}
        alt={coupon?.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* ===== BUMBLE-STYLE GRADIENT ===== 
          Clean gradient from transparent at top to solid black at bottom
          This ensures text is always readable regardless of image */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.85) 15%,
            rgba(0, 0, 0, 0.5) 35%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 70%
          )`
        }}
      />
      
      {/* ===== TEXT OVERLAY - BUMBLE STYLE ===== 
          Bold, confident, minimal - just the essentials */}
      <div className="absolute bottom-0 left-0 right-0 
                      p-6 pb-[calc(env(safe-area-inset-bottom,1rem)+4rem)]">
        
        {/* SAVINGS AMOUNT - The Hero */}
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-7xl font-black text-white leading-none tracking-tight">
            {displayValue}
          </h1>
          <span className="text-2xl font-bold text-white/80 uppercase tracking-wider">
            off
          </span>
        </div>
        
        {/* PRODUCT NAME - Clean and Clear */}
        <h2 className="text-2xl font-semibold text-white leading-tight mb-4 
                       max-w-[90%]">
          {coupon?.description}
        </h2>
        
        {/* METADATA ROW - Subtle but informative */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Badge */}
          {coupon?.category && (
            <span className="px-3 py-1 rounded-full 
                           bg-white/15 backdrop-blur-sm
                           text-sm font-medium text-white/90">
              {coupon.category}
            </span>
          )}
          
          {/* Personalized Badge */}
          {coupon?.isPersonalized && (
            <span className="px-3 py-1 rounded-full 
                           bg-yellow-500/20 backdrop-blur-sm
                           text-sm font-medium text-yellow-300">
              ✨ For You
            </span>
          )}
          
          {/* Expiration - only if expiring soon */}
          {coupon?.expiresAt && isExpiringSoon(coupon.expiresAt) && (
            <span className="px-3 py-1 rounded-full 
                           bg-red-500/20 backdrop-blur-sm
                           text-sm font-medium text-red-300">
              Expires soon
            </span>
          )}
        </div>

        {/* Reason for recommendation - subtle */}
        {coupon?.reason && (
          <p className="mt-3 text-sm text-white/60 font-medium">
            {coupon.reason}
          </p>
        )}
      </div>
    </div>
  );
};

// Helper: Check if coupon expires within 3 days
function isExpiringSoon(expiresAt: string): boolean {
  const expDate = new Date(expiresAt);
  const now = new Date();
  const daysUntilExpiry = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
}

export default CouponCard;
