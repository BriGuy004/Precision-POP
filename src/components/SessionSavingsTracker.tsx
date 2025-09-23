
import { useState, useEffect } from "react";
import { BadgeDollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SessionSavingsTrackerProps {
  savedAmount: number;
  mobileView?: boolean;
}

const SessionSavingsTracker = ({ savedAmount, mobileView = false }: SessionSavingsTrackerProps) => {
  const [showPulse, setShowPulse] = useState(false);
  
  // Show pulse animation when amount changes
  useEffect(() => {
    if (savedAmount > 0) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [savedAmount]);
  
  // If no savings and in mobile view, show nothing
  if (savedAmount === 0 && mobileView) {
    return null;
  }
  
  // For mobile view, show a compact button
  if (mobileView) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-green-500 text-white rounded-full px-3 py-1.5",
          "flex items-center gap-1 shadow-lg z-20",
          showPulse && "animate-[pulse_1s_ease-in-out]"
        )}
      >
        <BadgeDollarSign className="w-4 h-4" />
        <span className="font-bold text-sm">${savedAmount.toFixed(2)}</span>
      </motion.div>
    );
  }
  
  // Original desktop version
  return (
    <AnimatePresence>
      {savedAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            "fixed top-20 right-4 bg-green-500 text-white rounded-full px-4 py-2.5",
            "flex items-center gap-2 shadow-lg z-20",
            showPulse && "animate-[pulse_1s_ease-in-out]"
          )}
        >
          <BadgeDollarSign className="w-5 h-5" />
          <span className="font-bold text-lg">${savedAmount.toFixed(2)}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionSavingsTracker;
