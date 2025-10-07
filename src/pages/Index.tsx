import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRetailer } from "@/contexts/RetailerContext"; // 🎨 WHITE-LABEL IMPORT
import krogerLogo from "@/assets/kroger-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { retailer, retailerId } = useRetailer(); // 🎨 WHITE-LABEL HOOK
  
  // Handle login
  const handleLogin = () => {
    navigate("/login");
  };
  
  // Handle signup
  const handleSignup = () => {
    navigate("/login", { state: { isSignup: true } });
  };
  
  return (
    <div className="container mx-auto px-4 pb-12 pt-5">
      {/* 🎨 WHITE-LABELED LOGO - Dynamic Retailer Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-4"
      >
        <div className="flex items-center gap-4">
          {retailerId === 'kroger' ? (
            <img 
              src={krogerLogo} 
              alt={`${retailer.name} Logo`}
              className="h-32 w-auto"
            />
          ) : (
            <div 
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold text-5xl shadow-xl"
              style={{ backgroundColor: retailer.theme.primary }}
            >
              {retailer.shortName.charAt(0)}
            </div>
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {/* 🎨 WHITE-LABELED WELCOME TEXT - Dynamic Retailer Name */}
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to {retailer.name}
          <br />
          Alice!
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {retailer.tagline}
        </motion.p>
      </motion.div>
      
      {/* 🎨 WHITE-LABELED LOYALTY CARD - Dynamic Colors */}
      <motion.div 
        className="max-w-md mx-auto mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div 
          className="aspect-[1.586/1] rounded-2xl overflow-hidden glass-card shadow-lg flex flex-col justify-between p-6 relative"
          style={{
            background: `linear-gradient(to bottom right, ${retailer.theme.primary}90, ${retailer.theme.primary}60)`,
          }}
        >
          {/* 🎨 WHITE-LABELED WATERMARK - Dynamic Retailer Logo/Initial */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            {retailerId === 'kroger' ? (
              <img 
                src={krogerLogo} 
                alt=""
                className="h-64 w-auto"
              />
            ) : (
              <div 
                className="text-white font-bold"
                style={{ fontSize: '10rem' }}
              >
                {retailer.shortName.charAt(0)}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mt-1">Loyalty Card</h3>
          </div>
          <div>
            <p className="text-sm text-white/70">Cardholder</p>
            <p className="text-lg font-medium text-white">Alice Tillett</p>
            <p className="text-sm font-medium text-white/90 mt-1">•••• •••• •••• 4242</p>
          </div>
        </div>
      </motion.div>
      
      {/* 🎨 WHITE-LABELED BUTTONS - Dynamic Colors */}
      <motion.div 
        className="flex flex-col gap-3 max-w-xs mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Button 
          onClick={handleLogin} 
          className="w-full text-white"
          style={{ 
            backgroundColor: retailer.theme.primary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${retailer.theme.primary}dd`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = retailer.theme.primary;
          }}
        >
          Log In
        </Button>
        <Button 
          onClick={handleSignup} 
          variant="outline" 
          className="w-full"
          style={{
            borderColor: retailer.theme.primary,
            color: retailer.theme.primary,
          }}
        >
          Sign Up
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
