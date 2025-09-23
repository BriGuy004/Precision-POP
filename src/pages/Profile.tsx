
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  History,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import SavingsDashboard from "@/components/SavingsDashboard";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Alice Tillett",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    cardNumber: "4242424242424242",
    points: 7500,
    level: "Gold",
    expiryDate: "12/25",
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      specialOffers: true,
      newsletterSubscription: false,
    },
  });
  
  // Menu items
  const menuItems = [
    {
      name: "Account Settings",
      icon: <Settings className="w-5 h-5" />,
      action: () => setIsEditing(true),
    },
    {
      name: "Payment Methods",
      icon: <CreditCard className="w-5 h-5" />,
      action: () => {},
    },
    {
      name: "Privacy & Security",
      icon: <ShieldCheck className="w-5 h-5" />,
      action: () => {},
    },
    {
      name: "Order History",
      icon: <History className="w-5 h-5" />,
      action: () => {},
    },
    {
      name: "Help & Support",
      icon: <HelpCircle className="w-5 h-5" />,
      action: () => {},
    },
    {
      name: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      action: () => {},
      danger: true,
    },
  ];
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
    setIsEditing(false);
  };
  
  // Toggle notification settings
  const toggleNotification = (key: keyof typeof userData.notifications) => {
    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        My Profile
      </motion.h1>
      
      {isEditing ? (
        <motion.form
          onSubmit={handleSubmit}
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="bg-background/50"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="bg-background/50"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="bg-background/50"
              />
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium mb-3">Notification Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="cursor-pointer">
                  Email Notifications
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={userData.notifications.emailNotifications}
                  onCheckedChange={() => toggleNotification("emailNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications" className="cursor-pointer">
                  Push Notifications
                </Label>
                <Switch
                  id="pushNotifications"
                  checked={userData.notifications.pushNotifications}
                  onCheckedChange={() => toggleNotification("pushNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="specialOffers" className="cursor-pointer">
                  Special Offers
                </Label>
                <Switch
                  id="specialOffers"
                  checked={userData.notifications.specialOffers}
                  onCheckedChange={() => toggleNotification("specialOffers")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="newsletterSubscription" className="cursor-pointer">
                  Newsletter Subscription
                </Label>
                <Switch
                  id="newsletterSubscription"
                  checked={userData.notifications.newsletterSubscription}
                  onCheckedChange={() => toggleNotification("newsletterSubscription")}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button type="submit">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      ) : (
        <>
          <motion.div
            className="glass-card p-6 rounded-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          </motion.div>
          
          {/* Loyalty Card Section */}
          <motion.div
            className="glass-card rounded-xl overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div 
              className="p-6 flex justify-between items-center cursor-pointer border-b border-border"
              onClick={() => setIsCardExpanded(!isCardExpanded)}
            >
              <h2 className="text-lg font-semibold">My Loyalty Card</h2>
              {isCardExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            {isCardExpanded && (
              <div className="p-6">
                <LoyaltyCard
                  name={userData.name}
                  cardNumber={userData.cardNumber}
                  points={userData.points}
                  level={userData.level}
                  expiryDate={userData.expiryDate}
                />
              </div>
            )}
          </motion.div>
          
          {/* Savings Dashboard */}
          <SavingsDashboard />
          
          {/* Account Menu */}
          <motion.div
            className="glass-card rounded-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                className={`w-full px-6 py-4 flex items-center justify-between hover:bg-accent/30 transition-colors ${
                  index !== menuItems.length - 1 && "border-b border-border"
                } ${item.danger ? "text-red-500" : ""}`}
                onClick={item.action}
                variants={itemVariants}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {!item.danger && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Profile;
