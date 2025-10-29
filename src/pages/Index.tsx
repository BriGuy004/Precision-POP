import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRetailer } from "@/contexts/BrandContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { retailer } = useRetailer();

  // Mock data - would come from auth/database
  const customerName = "Alice";
  const weekSavings = 47.50;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 pb-24">
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top center, ${retailer.theme.primary}, transparent 60%)`
        }}
      />

      <div className="relative z-10 max-w-md w-full">
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={retailer.logo}
            alt={retailer.name}
            className="h-20 w-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-black text-white mb-4">
            Welcome Back, {customerName}! 👋
          </h1>
          <p className="text-xl text-white/60">
            You've saved{" "}
            <span 
              className="font-bold"
              style={{ color: retailer.theme.accent }}
            >
              ${weekSavings.toFixed(2)}
            </span>{" "}
            this week
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            className="w-full text-lg py-7 rounded-2xl shadow-2xl hover:shadow-xl transition-all group"
            style={{
              background: `linear-gradient(135deg, ${retailer.theme.primary}, ${retailer.theme.secondary})`
            }}
            onClick={() => navigate("/coupons")}
          >
            Start Shopping
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Bottom hint */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-white/40">
            Tap the profile icon to see your full savings
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
