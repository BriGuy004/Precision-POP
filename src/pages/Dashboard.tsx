
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoyaltyCard from "@/components/LoyaltyCard";
import PointsTracker from "@/components/PointsTracker";
import ProductCard from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("card");
  
  // Mock user data
  const userData = {
    name: "John Doe",
    cardNumber: "4242424242424242",
    points: 7500,
    level: "Gold",
    expiryDate: "12/25",
  };
  
  // Mock points history
  const pointsHistory = [
    {
      date: "2023-04-15",
      amount: 250,
      type: "earned" as const,
      description: "Grocery purchase",
    },
    {
      date: "2023-04-10",
      amount: 100,
      type: "spent" as const,
      description: "Redeemed for discount",
    },
    {
      date: "2023-04-05",
      amount: 150,
      type: "earned" as const,
      description: "Grocery purchase",
    },
    {
      date: "2023-03-28",
      amount: 300,
      type: "earned" as const,
      description: "Bonus points promotion",
    },
    {
      date: "2023-03-20",
      amount: 200,
      type: "earned" as const,
      description: "Grocery purchase",
    },
    {
      date: "2023-03-15",
      amount: 150,
      type: "spent" as const,
      description: "Redeemed for discount",
    },
  ];
  
  // Mock featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Organic Fresh Strawberries",
      price: 4.99,
      originalPrice: 6.99,
      image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Produce",
      pointsEarned: 50,
      isFeatured: true,
    },
    {
      id: "2",
      name: "Premium Coffee Beans",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Beverages",
      pointsEarned: 100,
    },
    {
      id: "3",
      name: "Freshly Baked Sourdough Bread",
      price: 3.99,
      originalPrice: 4.99,
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Bakery",
      pointsEarned: 40,
    },
  ];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // View all special offers
  const viewAllOffers = () => {
    navigate("/shop");
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Welcome, {userData.name.split(" ")[0]}
      </motion.h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full h-auto p-1 bg-muted">
          <TabsTrigger value="card" className="py-2.5">Loyalty Card</TabsTrigger>
          <TabsTrigger value="points" className="py-2.5">Points & Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="mt-6 space-y-6">
          <LoyaltyCard
            name={userData.name}
            cardNumber={userData.cardNumber}
            points={userData.points}
            level={userData.level}
            expiryDate={userData.expiryDate}
          />
          
          <div className="glass-card p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Special Offers</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-sm flex items-center"
                onClick={viewAllOffers}
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.slice(0, 2).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="points" className="mt-6">
          <PointsTracker
            currentPoints={userData.points}
            pointsHistory={pointsHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
