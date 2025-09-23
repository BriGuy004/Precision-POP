
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface LoyaltyCardProps {
  name: string;
  cardNumber: string;
  points: number;
  level: string;
  expiryDate: string;
}

const LoyaltyCard = ({
  name,
  cardNumber,
  points,
  level,
  expiryDate,
}: LoyaltyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format card number to show only last 4 digits
  const formatCardNumber = (number: string) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };
  
  // Generate barcode
  const generateBarcode = () => {
    // This is a placeholder for barcode generation
    // In a real app, you would use a barcode library
    return (
      <div className="h-16 flex items-center justify-center bg-white rounded-md">
        <div className="flex space-x-0.5">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-12"
              style={{
                backgroundColor: "black",
                height: `${Math.max(60, Math.random() * 100)}%`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        className="relative cursor-pointer w-full aspect-[1.586/1] rounded-2xl shadow-lg overflow-hidden glass-card"
        onClick={() => setIsFlipped(!isFlipped)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card front */}
        <motion.div
          className="absolute inset-0 flex flex-col p-6 bg-gradient-to-br from-red-600 to-red-500"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0, opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-white">Loyalty Card</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-xs font-medium text-white">{level} Member</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end mt-4">
            <p className="text-sm text-white/80">Cardholder</p>
            <p className="text-lg font-medium text-white">{name}</p>
            <p className="text-sm font-medium text-white/90 mt-2">{formatCardNumber(cardNumber)}</p>
          </div>
        </motion.div>
        
        {/* Card back */}
        <motion.div
          className="absolute inset-0 flex flex-col p-6 bg-gradient-to-br from-red-600 to-red-500"
          initial={{ rotateY: -180 }}
          animate={{ rotateY: isFlipped ? 0 : -180, opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="mb-2">
            <p className="text-xs text-white/80">Member since</p>
            <p className="text-sm font-medium text-white">Jan 2023</p>
          </div>
          
          <div className="bg-black/10 h-12 rounded-md flex items-center px-4 mb-3">
            <p className="text-sm font-mono text-white">{cardNumber}</p>
          </div>
          
          {generateBarcode()}
          
          <div className="mt-2 text-right">
            <p className="text-xs text-white/80">Valid until</p>
            <p className="text-sm font-medium text-white">{expiryDate}</p>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Card details */}
      <motion.div
        className="mt-4 glass-card rounded-xl p-4 overflow-hidden"
        initial={{ height: "auto" }}
        animate={{ height: isExpanded ? "auto" : "60px" }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Current Points</p>
              <p className="text-lg font-semibold">{points.toLocaleString()}</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        
        {/* Expanded content */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Next level at</p>
            <p className="text-sm font-medium">10,000 points</p>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 rounded-full"
              style={{ width: `${Math.min(100, (points / 10000) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Points expiring soon</p>
            <p className="text-sm font-medium">500 pts on May 31</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoyaltyCard;
