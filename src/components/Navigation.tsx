
import { Link, useLocation } from "react-router-dom";
import { Home, User, Gift, ShoppingBag, ListPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Coupons",
      path: "/coupons",
      icon: Gift,
    },
    {
      name: "Shop",
      path: "/shop",
      icon: ShoppingBag,
    },
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "List",
      path: "/shopping-list",
      icon: ListPlus,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-between">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-3 px-2 text-xs transition-colors",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
