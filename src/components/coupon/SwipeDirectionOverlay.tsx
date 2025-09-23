import React from "react";
import { motion } from "framer-motion";
import { X, Heart, Sparkles } from "lucide-react";
import { MotionValue } from "framer-motion";

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
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
      {/* Left overlay (discard) */}
      <motion.div
        className="absolute inset-0 bg-red-500 flex items-center justify-center"
        style={{ opacity: bgOpacityLeft }}
      >
        <div className="bg-white/90 text-red-500 px-6 py-2 rounded-full font-bold text-xl transform -rotate-12">
          Skip
        </div>
      </motion.div>
      
      {/* Right overlay (keep) */}
      <motion.div
        className="absolute inset-0 bg-green-500 flex items-center justify-center"
        style={{ opacity: bgOpacityRight }}
      >
        <div className="bg-white/90 text-green-500 px-6 py-2 rounded-full font-bold text-xl transform rotate-12">
          Save
        </div>
      </motion.div>
      
      {/* Badge for personalized & AI coupons */}
      {isPersonalized && (
        <div className="absolute top-2 right-2 z-20">
          <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
            isAiGenerated 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'bg-yellow-400 text-yellow-800'
          }`}>
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
