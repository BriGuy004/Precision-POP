
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Gift, Calendar } from "lucide-react";

interface PointsHistoryItem {
  date: string;
  amount: number;
  type: "earned" | "spent";
  description: string;
}

interface PointsTrackerProps {
  currentPoints: number;
  pointsHistory: PointsHistoryItem[];
}

const PointsTracker = ({ currentPoints, pointsHistory }: PointsTrackerProps) => {
  const historyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to most recent transactions
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = 0;
    }
  }, [pointsHistory]);

  // Group history items by month
  const groupedHistory = pointsHistory.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(item);
    return acc;
  }, {} as Record<string, PointsHistoryItem[]>);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Summary */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4">Points Summary</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="glass p-3 rounded-lg flex flex-col items-center">
            <TrendingUp className="w-5 h-5 text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-semibold">{currentPoints}</p>
          </div>
          
          <div className="glass p-3 rounded-lg flex flex-col items-center">
            <Gift className="w-5 h-5 text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Rewards</p>
            <p className="text-lg font-semibold">3</p>
          </div>
          
          <div className="glass p-3 rounded-lg flex flex-col items-center">
            <Calendar className="w-5 h-5 text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Expiring</p>
            <p className="text-lg font-semibold">500</p>
          </div>
        </div>
      </motion.div>
      
      {/* History */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold">Points History</h3>
        </div>
        
        <div 
          ref={historyRef}
          className="max-h-[400px] overflow-y-auto scrollbar-hide p-6 space-y-6"
        >
          {Object.entries(groupedHistory).map(([month, items]) => (
            <div key={month}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{month}</h4>
              
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${item.type === "earned" ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <p className="text-sm font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${item.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                      {item.type === "earned" ? "+" : "-"}{item.amount}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PointsTracker;
