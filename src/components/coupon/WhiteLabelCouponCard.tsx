
import React from "react";
import { Star, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRetailer } from "@/contexts/RetailerContext";
import krogerLogo from "@/assets/kroger-logo.png";
import hebLogo from "@/assets/heb-logo.png";

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

const getCouponGradient = (category?: string) => {
  switch(category?.toLowerCase()) {
    case "snacks":
      return "bg-gradient-to-tr from-orange-50 to-amber-100";
    case "produce":
      return "bg-gradient-to-tr from-green-50 to-emerald-100";
    case "beverages":
      return "bg-gradient-to-tr from-blue-50 to-sky-100";
    case "bakery":
      return "bg-gradient-to-tr from-amber-50 to-yellow-100";
    case "dairy":
      return "bg-gradient-to-tr from-slate-50 to-slate-100";
    case "meat":
      return "bg-gradient-to-tr from-red-50 to-rose-100";
    default:
      return "bg-gradient-to-tr from-purple-50 to-violet-100";
  }
};

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, className }) => {
  const { retailer, retailerId } = useRetailer(); // 🎨 WHITE-LABEL HOOK

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden shadow-xl h-full",
        className
      )}
      data-coupon-id={coupon?.id}
      data-coupon-value={coupon?.value.toFixed(2)}
    >
      {/* BUMBLE-STYLE: Full-height image background */}
      <div className="relative h-full w-full">
        <img
          src={coupon?.image}
          alt={coupon?.description}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark gradient overlay at bottom (Bumble-style) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* 🎨 WHITE-LABELED LOGO - Top left */}
        {retailerId === 'kroger' ? (
          <div className="absolute top-4 left-4 z-10">
            <img 
              src={krogerLogo} 
              alt=""
              className="h-10 w-auto drop-shadow-lg"
            />
          </div>
        ) : retailerId === 'heb' ? (
          <div className="absolute top-4 left-4 z-10">
            <img 
              src={hebLogo} 
              alt=""
              className="h-10 w-auto drop-shadow-lg"
            />
          </div>
        ) : (
          <div className="absolute top-4 left-4 z-10 p-2 rounded-full shadow-lg" style={{
            backgroundColor: retailer.theme.primary,
          }}>
            <div className="w-7 h-7 flex items-center justify-center text-white font-bold">
              {retailer.shortName.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Personalization badge - Top right */}
        {coupon?.isPersonalized && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-yellow-400 rounded-full flex items-center gap-1 shadow-lg">
            <span className="text-xs font-bold text-yellow-900">✨ For You</span>
          </div>
        )}
        
        {/* BUMBLE-STYLE: Bottom content overlay with white text */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {/* Value badge */}
          <div className="flex justify-end mb-3">
            <div 
              className="text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-lg"
              style={{ backgroundColor: retailer.theme.accent }}
            >
              <Scissors className="w-4 h-4" />
              <span>${coupon?.value.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Title and description - White text on dark overlay */}
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {coupon?.title}
          </h3>
          <p className="text-base text-white/90 font-medium line-clamp-2 mb-3 drop-shadow-md">
            {coupon?.description}
          </p>
          
          {/* Reason for recommendation */}
          {coupon?.reason && (
            <p className="text-xs text-yellow-300 font-semibold mb-2 drop-shadow-md">
              💡 {coupon.reason}
            </p>
          )}
          
          {/* Expiration */}
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: retailer.theme.error }}
          >
            Expires Today
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
