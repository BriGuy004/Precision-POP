import { motion } from "framer-motion";
import { Zap, TrendingUp, Gift, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRetailer } from "@/contexts/RetailerContext";
import SavingsDashboard from "@/components/SavingsDashboard";

const Index = () => {
  const navigate = useNavigate();
  const { retailer } = useRetailer();

  const quickActions = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Today's Deals",
      subtitle: "17 new coupons",
      color: "from-yellow-500 to-orange-500",
      action: () => navigate("/coupons")
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Weekly Rewards",
      subtitle: "+250 points",
      color: "from-purple-500 to-pink-500",
      action: () => navigate("/profile")
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart List",
      subtitle: "8 items",
      color: "from-green-500 to-emerald-500",
      action: () => navigate("/list")
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Shop Now",
      subtitle: "Browse all",
      color: "from-blue-500 to-cyan-500",
      action: () => navigate("/shop")
    }
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden pb-6">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${retailer.theme.primary}, transparent 70%)`
          }}
        />
        
        <div className="relative z-10 px-4 pt-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={retailer.logo}
              alt={retailer.name}
              className="h-16 w-auto drop-shadow-2xl"
            />
          </div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-black text-white mb-2">
              Welcome Back, Alice!
            </h1>
            <p className="text-white/60">
              You've saved $47.50 this week 🎉
            </p>
          </motion.div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="relative overflow-hidden rounded-2xl p-4 text-left group"
              >
                {/* Gradient background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 text-white">
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-white/80">
                    {action.subtitle}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Dashboard */}
      <div className="px-4">
        <SavingsDashboard />
      </div>
    </div>
  );
};

export default Index;
