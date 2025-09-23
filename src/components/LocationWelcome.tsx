
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { personalizationService } from "../services/PersonalizationService";

interface LocationWelcomeProps {
  storeName?: string;
  userName?: string;
  userId?: string;
}

const LocationWelcome = ({ 
  storeName = "H-E-B", 
  userName = "Alice",
  userId = "user123" 
}: LocationWelcomeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [detectedStore, setDetectedStore] = useState<string | null>(null);

  // Simulate location detection using personalization service
  useEffect(() => {
    const detectEntry = async () => {
      try {
        // Simulate a store entry detection via backend
        const entryData = await personalizationService.detectStoreEntry(userId, "store123");
        
        if (entryData.detected) {
          setDetectedStore(entryData.storeName);
          setIsVisible(true);
          
          // Also load personalized coupons when customer enters store
          const personalizedCoupons = await personalizationService.getPersonalizedCoupons(userId);
          console.log("Loaded personalized coupons:", personalizedCoupons);
          
          // Store customer name in sessionStorage for use across components
          sessionStorage.setItem('customerName', userName);
        }
      } catch (error) {
        console.error("Error detecting store entry:", error);
      }
    };

    // For demo purposes, show after a short delay
    const timer = setTimeout(() => {
      detectEntry();
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId, userName]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Auto dismiss after 5 seconds
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const displayStoreName = detectedStore || storeName;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed top-4 left-0 right-0 mx-auto z-50 w-[90%] max-w-md"
        >
          <div className="glass-card bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-xl shadow-lg">
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="font-bold text-lg">Welcome to {displayStoreName}!</h3>
                <p className="text-sm text-white/80">
                  Hi {userName}! Personal coupons based on your shopping history are ready for you.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocationWelcome;
