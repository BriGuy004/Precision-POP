
import { useState } from "react";
import { motion } from "framer-motion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { BadgeDollarSign, TrendingUp, BarChart3, Calendar } from "lucide-react";

interface SavingsData {
  month: string;
  amount: number;
}

const SavingsDashboard = () => {
  // Mock savings data - in a real app, this would come from the API
  const [savingsData, setSavingsData] = useState<SavingsData[]>([
    { month: "Jan", amount: 24.50 },
    { month: "Feb", amount: 31.75 },
    { month: "Mar", amount: 42.30 },
    { month: "Apr", amount: 38.90 },
    { month: "May", amount: 52.45 },
    { month: "Jun", amount: 47.80 },
  ]);
  
  const totalSaved = savingsData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
  const averageSaved = (savingsData.reduce((sum, item) => sum + item.amount, 0) / savingsData.length).toFixed(2);
  
  // Mock savings stats
  const savingsStats = [
    {
      title: "Total Saved",
      value: `$${totalSaved}`,
      icon: BadgeDollarSign,
      color: "text-green-500",
    },
    {
      title: "This Month",
      value: `$${savingsData[savingsData.length - 1].amount.toFixed(2)}`,
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Avg. Monthly",
      value: `$${averageSaved}`,
      icon: BarChart3,
      color: "text-purple-500",
    },
    {
      title: "Trend",
      value: "+12.5%",
      icon: TrendingUp,
      color: "text-pink-500",
    },
  ];
  
  const chartConfig = {
    savings: {
      label: "Savings",
      theme: {
        light: "#10b981",
        dark: "#10b981",
      },
    },
  };
  
  return (
    <motion.div 
      className="glass-card rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">Savings Dashboard</h2>
        <p className="text-sm text-muted-foreground">Track your coupon savings over time</p>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {savingsStats.map((stat, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg bg-accent/40 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.title}</span>
              </div>
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>
        
        <div className="h-60 w-full">
          <ChartContainer config={chartConfig}>
            <LineChart data={savingsData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Saved"]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="amount"
                name="savings"
                stroke="var(--color-savings, #10b981)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SavingsDashboard;
