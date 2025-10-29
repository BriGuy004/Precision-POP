import React from "react";
import { motion } from "framer-motion";
import { X, Heart, Sparkles } from "lucide-react";
import { MotionValue } from "framer-motion";
import { useRetailer } from "@/contexts/BrandContext";

interface SwipeDirectionOverlayProps {
  bgOpacityLeft: MotionValue<number>;
  bgOpacityRight: MotionValue<number>;
  isPersonalized?: boolean;
  isAiGenerated?: boolean;
}

const SwipeDirectionOverlay = ({ 
  bgOpacityLeft, 
  bgOpacityRight, 
  isPersonalized,
  isAiGenerated
}: SwipeDirectionOverlayProps) => {
  const { retailer } = useRetailer(); // 🎨 WHITE-LABEL HOOK

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
      {/* 🎨 WHITE-LABELED LEFT OVERLAY (discard) - Uses retailer error color */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          opacity: bgOpacityLeft,
          backgroundColor: retailer.theme.error,
        }}
      >
        <div 
          className="bg-white/90 px-6 py-2 rounded-full font-bold text-xl transform -rotate-12"
          style={{ color: retailer.theme.error }}
        >
          Skip
        </div>
      </motion.div>
      
      {/* 🎨 WHITE-LABELED RIGHT OVERLAY (keep) - Uses retailer success color */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          opacity: bgOpacityRight,
          backgroundColor: retailer.theme.success,
        }}
      >
        <div 
          className="bg-white/90 px-6 py-2 rounded-full font-bold text-xl transform rotate-12"
          style={{ color: retailer.theme.success }}
        >
          Save
        </div>
      </motion.div>
      
      {/* 🎨 WHITE-LABELED BADGE - Uses retailer accent/secondary colors */}
      {isPersonalized && (
        <div className="absolute top-2 right-2 z-20">
          <div 
            className="px-2 py-1 rounded-full text-xs font-bold shadow-lg text-white"
            style={{
              background: isAiGenerated 
                ? `linear-gradient(to right, ${retailer.theme.secondary}, ${retailer.theme.accent})`
                : retailer.theme.accent,
            }}
          >
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>
                {isAiGenerated ? 'AI Generated' : 'For You'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeDirectionOverlay;
