import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
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
      {/* HEB Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-4"
      >
        <img 
          src="/lovable-uploads/10591ab9-a989-4062-9a50-f50702ca53e4.png" 
          alt="H-E-B Logo" 
          className="h-40 w-auto"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to H-E-B
          <br />
          Alice!
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your digital loyalty card for a smarter shopping experience
        </motion.p>
      </motion.div>
      
      {/* Hero Image */}
      <motion.div 
        className="max-w-md mx-auto mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="aspect-[1.586/1] rounded-2xl overflow-hidden glass-card bg-gradient-to-br from-[#ea384c]/90 to-[#ea384c]/60 shadow-lg flex flex-col justify-between p-6 relative">
          {/* H-E-B Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img 
              src="/lovable-uploads/10591ab9-a989-4062-9a50-f50702ca53e4.png" 
              alt="H-E-B Logo Watermark" 
              className="w-2/3 h-auto"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-primary-foreground mt-1">Loyalty Card</h3>
          </div>
          <div>
            <p className="text-sm text-primary-foreground/70">Cardholder</p>
            <p className="text-lg font-medium text-primary-foreground">Alice Tillett</p>
            <p className="text-sm font-medium text-primary-foreground/90 mt-1">•••• •••• •••• 4242</p>
          </div>
        </div>
      </motion.div>
      
      {/* CTAs */}
      <motion.div 
        className="flex flex-col gap-3 max-w-xs mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Button onClick={handleLogin} className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90">
          Log In
        </Button>
        <Button onClick={handleSignup} variant="outline" className="w-full">
          Sign Up
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
