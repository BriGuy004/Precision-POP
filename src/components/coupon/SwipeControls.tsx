
import { X, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="absolute bottom-[-72px] flex items-center justify-center gap-4 w-full">
      {/* Left swipe button */}
      <motion.button
        className="bg-white shadow-xl rounded-full p-4 cursor-pointer border border-red-200 text-red-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSwipeLeft}
      >
        <X className="w-8 h-8" />
      </motion.button>
      
      {/* Right swipe button */}
      <motion.button
        className="bg-white shadow-xl rounded-full p-4 cursor-pointer border border-green-200 text-green-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSwipeRight}
      >
        <Check className="w-8 h-8" />
      </motion.button>
      
      {/* Personalized indicator */}
      {isPersonalized && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-[-40px] px-3 py-1 rounded-full text-xs ${
            isAiGenerated 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-yellow-100 text-yellow-800'
          }`}
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
