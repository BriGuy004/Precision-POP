
import { motion } from "framer-motion";
import { DollarSign, Sparkles } from "lucide-react";
import { useRetailer } from "@/contexts/BrandContext";

interface SessionSavingsTrackerProps {
  savedAmount: number;
  mobileView?: boolean;
}

const SessionSavingsTracker = ({ savedAmount, mobileView = false }: SessionSavingsTrackerProps) => {
  const { retailer } = useRetailer(); // 🎨 WHITE-LABEL HOOK

  if (mobileView) {
    // Compact mobile version
    return (
      <motion.div
        className="rounded-full px-3 py-1 shadow-lg flex items-center gap-1"
        style={{
          backgroundColor: retailer.theme.success,
          color: 'white',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <DollarSign className="w-4 h-4" />
        <span className="font-bold text-sm">${savedAmount.toFixed(2)}</span>
      </motion.div>
    );
  }

  // Desktop version
  return (
    <motion.div
      className="glass-card p-3 rounded-xl shadow-lg mb-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${retailer.theme.success}20` }}
          >
            <Sparkles 
              className="w-5 h-5"
              style={{ color: retailer.theme.success }}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Session Savings</p>
            <p 
              className="text-2xl font-bold"
              style={{ color: retailer.theme.success }}
            >
              ${savedAmount.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div 
          className="px-4 py-2 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: retailer.theme.primary }}
        >
          {savedAmount > 0 ? `${Math.round((savedAmount / 50) * 100)}% to goal` : 'Start saving!'}
        </div>
      </div>
    </motion.div>
  );
};

export default SessionSavingsTracker;
