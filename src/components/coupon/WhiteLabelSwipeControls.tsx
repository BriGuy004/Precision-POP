
import { X, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRetailer } from "@/contexts/RetailerContext";

interface SwipeControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isPersonalized?: boolean;
  isAiGenerated?: boolean;
}

const SwipeControls = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  isPersonalized,
  isAiGenerated
}: SwipeControlsProps) => {
  const { retailer } = useRetailer(); // 🎨 WHITE-LABEL HOOK

  return (
    <div className="absolute bottom-[-72px] flex items-center justify-center gap-4 w-full">
      {/* 🎨 WHITE-LABELED LEFT BUTTON - Uses retailer error color */}
      <motion.button
        className="bg-white shadow-xl rounded-full p-4 cursor-pointer border-2"
        style={{
          borderColor: `${retailer.theme.error}40`,
          color: retailer.theme.error,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSwipeLeft}
      >
        <X className="w-8 h-8" />
      </motion.button>
      
      {/* 🎨 WHITE-LABELED RIGHT BUTTON - Uses retailer success color */}
      <motion.button
        className="bg-white shadow-xl rounded-full p-4 cursor-pointer border-2"
        style={{
          borderColor: `${retailer.theme.success}40`,
          color: retailer.theme.success,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSwipeRight}
      >
        <Check className="w-8 h-8" />
      </motion.button>
      
      {/* 🎨 WHITE-LABELED PERSONALIZED INDICATOR */}
      {isPersonalized && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-[-40px] px-3 py-1 rounded-full text-xs text-white"
          style={{
            background: isAiGenerated 
              ? `linear-gradient(to right, ${retailer.theme.secondary}, ${retailer.theme.accent})`
              : retailer.theme.accent,
          }}
        >
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{isAiGenerated ? 'AI Personalized Offer' : 'Personalized For You'}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SwipeControls;
