
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useRetailer } from "@/contexts/RetailerContext"; // 🎨 WHITE-LABEL IMPORT
import { useDarkMode } from "@/hooks/use-dark-mode";
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
  Store,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import SavingsDashboard from "@/components/SavingsDashboard";
import krogerLogo from "@/assets/kroger-logo.png";
import hebLogo from "@/assets/heb-logo.png";

const Profile = () => {
  const { toast } = useToast();
  const { retailer, retailerId, switchRetailer, allRetailers } = useRetailer(); // 🎨 WHITE-LABEL HOOK
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isRetailerSwitcherExpanded, setIsRetailerSwitcherExpanded] = useState(false); // 🎨 NEW STATE
  
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
  
  // 🎨 Handle retailer switch
  const handleRetailerSwitch = (newRetailerId: string) => {
    switchRetailer(newRetailerId as any);
    toast({
      title: "Retailer Changed",
      description: `Switched to ${allRetailers[newRetailerId].name}`,
    });
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
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 md:pb-6">
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
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${retailer.theme.primary}20` }}
              >
                <User 
                  className="w-8 h-8"
                  style={{ color: retailer.theme.primary }}
                />
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

          {/* Dark Mode Toggle */}
          <motion.div
            className="glass-card p-6 rounded-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5" style={{ color: retailer.theme.primary }} />
                ) : (
                  <Sun className="w-5 h-5" style={{ color: retailer.theme.primary }} />
                )}
                <div>
                  <h3 className="font-semibold">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Make coupons stand out with dark theme
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </motion.div>
          
          {/* 🎨 RETAILER SWITCHER SECTION (NEW!) */}
          <motion.div
            className="glass-card rounded-xl overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div 
              className="p-4 flex justify-between items-center cursor-pointer border-b border-border"
              style={{ backgroundColor: `${retailer.theme.primary}10` }}
              onClick={() => setIsRetailerSwitcherExpanded(!isRetailerSwitcherExpanded)}
            >
              <div className="flex items-center gap-3">
                <Store 
                  className="w-5 h-5"
                  style={{ color: retailer.theme.primary }}
                />
                <div>
                  <h2 className="text-lg font-semibold">Demo: Retailer Branding</h2>
                  <p className="text-xs text-muted-foreground">
                    Switch between retailers to see white-label theming
                  </p>
                </div>
              </div>
              {isRetailerSwitcherExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            {isRetailerSwitcherExpanded && (
              <div className="p-4 space-y-3">
                {Object.entries(allRetailers).map(([id, config]) => (
                  <motion.button
                    key={id}
                    onClick={() => handleRetailerSwitch(id)}
                    className="w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md"
                    style={{
                      borderColor: retailerId === id ? config.theme.primary : '#e5e7eb',
                      backgroundColor: retailerId === id ? `${config.theme.primary}10` : 'white',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      {id === 'kroger' ? (
                        <img 
                          src={krogerLogo} 
                          alt={`${config.name} Logo`}
                          className="h-12 w-auto"
                        />
                      ) : id === 'heb' ? (
                        <img 
                          src={hebLogo} 
                          alt={`${config.name} Logo`}
                          className="h-12 w-auto"
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md"
                          style={{ backgroundColor: config.theme.primary }}
                        >
                          {config.shortName.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-semibold">{config.name}</div>
                        <div className="text-sm text-muted-foreground">{config.tagline}</div>
                      </div>
                    </div>
                    
                    {retailerId === id && (
                      <Check 
                        className="w-6 h-6" 
                        style={{ color: config.theme.primary }}
                      />
                    )}
                  </motion.button>
                ))}
                
                {/* Color Preview */}
                <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3 text-sm">Current Theme Colors:</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(retailer.theme).map(([key, color]) => (
                      <div key={key} className="text-xs">
                        <div 
                          className="w-full h-10 rounded border border-border mb-1"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-muted-foreground capitalize truncate">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
                  <p>🎨 All colors and branding update automatically</p>
                  <p>🚀 Deploy separate apps or use subdomains</p>
                  <p>💡 Perfect for investor demos</p>
                </div>
              </div>
            )}
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
