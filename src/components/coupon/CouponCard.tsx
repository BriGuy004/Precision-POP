
import React from "react";
import { Star, Scissors } from "lucide-react";
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
  return (
    <div 
      className={cn(
        "relative glass-card p-3 rounded-xl overflow-hidden shadow-xl",
        getCouponGradient(coupon?.category),
        className
      )}
      data-coupon-id={coupon?.id}
      data-coupon-value={coupon?.value.toFixed(2)}
    >
      <div className="relative h-full flex flex-col rounded-xl overflow-hidden">
        <div className="absolute top-2 left-2 z-10 bg-white/90 p-1.5 rounded-full shadow-md">
          <img src="/lovable-uploads/90ab9748-bbf9-4c76-bea3-2294d748f78e.png" alt="H-E-B" className="w-6 h-6 object-contain" />
        </div>
              
        {coupon?.isPersonalized && (
          <div className="absolute top-2 right-2 z-10 bg-yellow-400 p-1 rounded-full flex items-center shadow-md">
            <Star className="w-4 h-4 text-yellow-800" fill="currentColor" />
          </div>
        )}
              
        <div className="w-full h-[180px] overflow-hidden rounded-t-lg relative">
          <img
            src={coupon?.image}
            alt={coupon?.description}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
              
        <div className="flex-1 flex flex-col p-4 bg-white/90 rounded-b-lg shadow-inner relative">
          <div className="mt-3 pr-4">
            <h3 className="text-lg font-bold text-primary">{coupon?.title}</h3>
            <p className="text-sm text-gray-700 font-medium line-clamp-2 mt-1">{coupon?.description}</p>
                  
            {coupon?.reason && (
              <p className="text-xs mt-2 text-yellow-600 font-medium bg-yellow-50 p-1 rounded-lg inline-block">
                {coupon.reason}
              </p>
            )}
                  
            <div className="flex justify-between items-center mt-3">
              <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">
                Expires Today
              </div>
              <div className="bg-red-500 text-white px-2 py-0.5 rounded-full font-bold shadow-md flex items-center gap-1">
                <Scissors className="w-3 h-3" />
                <span>${coupon?.value.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
