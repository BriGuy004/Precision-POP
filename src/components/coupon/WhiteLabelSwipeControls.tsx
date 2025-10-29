
import { X, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRetailer } from "@/contexts/BrandContext";

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

  // Swipe-only interface - no visible buttons
  return null;
};

export default SwipeControls;
