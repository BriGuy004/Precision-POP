import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Zap, ShoppingBag, Award, Target, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRetailer } from "@/contexts/RetailerContext";

interface SavingsData {
  totalSaved: number;
  thisMonth: number;
  thisWeek: number;
  streak: number;
  couponsRedeemed: number;
  avgSavingsPerTrip: number;
  goalProgress: number;
  rank: string;
  nextMilestone: number;
}

const SavingsDashboard = () => {
  const { retailer } = useRetailer();
  
  // Mock data - replace with real API
  const [data] = useState<SavingsData>({
    totalSaved: 1247.50,
    thisMonth: 183.25,
    thisWeek: 47.50,
    streak: 12,
    couponsRedeemed: 87,
    avgSavingsPerTrip: 14.31,
    goalProgress: 73,
    rank: "Gold Saver",
    nextMilestone: 1500
  });

  const milestoneProgress = (data.totalSaved / data.nextMilestone) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white">Your Savings</h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ 
            background: `linear-gradient(135deg, ${retailer.theme.accent}, ${retailer.theme.secondary})`,
            color: 'white'
          }}
        >
          {data.rank}
        </motion.div>
      </div>

      {/* Hero Card - Total Savings */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${retailer.theme.primary}, ${retailer.theme.secondary})`
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-white/80" />
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">
              Total Saved
            </span>
          </div>
          <div className="text-5xl font-black text-white mb-1">
            ${data.totalSaved.toFixed(2)}
          </div>
          <p className="text-white/70 text-sm">
            That's {data.couponsRedeemed} coupons redeemed 🎉
          </p>
        </div>
        
        {/* Animated background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* This Month */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              This Month
            </span>
          </div>
          <div className="text-2xl font-black text-white mb-1">
            ${data.thisMonth.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>+23% vs last month</span>
          </div>
        </motion.div>

        {/* This Week */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              This Week
            </span>
          </div>
          <div className="text-2xl font-black text-white mb-1">
            ${data.thisWeek.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <Zap className="w-3 h-3" />
            <span>{data.streak} day streak!</span>
          </div>
        </motion.div>

        {/* Avg Per Trip */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Avg Per Trip
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            ${data.avgSavingsPerTrip.toFixed(2)}
          </div>
        </motion.div>

        {/* Coupons Used */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Coupons Used
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {data.couponsRedeemed}
          </div>
        </motion.div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-card border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            <span className="font-semibold text-white">Next Milestone</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ${data.nextMilestone.toFixed(0)}
          </span>
        </div>
        
        <Progress 
          value={milestoneProgress} 
          className="h-3 mb-2"
        />
        
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            ${(data.nextMilestone - data.totalSaved).toFixed(2)} to go
          </span>
          <span className="font-semibold text-white">
            {Math.round(milestoneProgress)}%
          </span>
        </div>
      </div>

      {/* Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Smart Savings Tip</h3>
            <p className="text-sm text-muted-foreground">
              You save 34% more when you shop on Wednesdays! Your next best day is this Wednesday.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Comparison */}
      <div className="bg-card border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-3">vs Average Shopper</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Your Savings Rate</span>
              <span className="font-bold text-green-400">18.5%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Average Shopper</span>
              <span className="font-bold text-white/40">12.3%</span>
            </div>
            <Progress value={61} className="h-2 opacity-40" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          You're saving <span className="font-bold text-green-400">50% more</span> than average! 🏆
        </p>
      </div>
    </div>
  );
};

export default SavingsDashboard;
