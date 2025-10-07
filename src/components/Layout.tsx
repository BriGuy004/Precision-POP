import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRetailer } from '@/contexts/RetailerContext';
import { Home, ShoppingCart, Ticket, User, List } from 'lucide-react';
import krogerLogo from "@/assets/kroger-logo.png";
import hebLogo from "@/assets/heb-logo.png";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { retailer, retailerId } = useRetailer();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/coupons', icon: Ticket, label: 'Coupons' },
    { path: '/shopping-list', icon: List, label: 'List' },
    { path: '/shop', icon: ShoppingCart, label: 'Shop' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Hide nav on login page
  const showNav = location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundColor: retailer.theme.background,
      color: retailer.theme.text,
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b shadow-sm" style={{
        backgroundColor: retailer.theme.background,
        borderBottomColor: `${retailer.theme.primary}20`,
      }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {retailerId === 'kroger' ? (
              <img 
                src={krogerLogo} 
                alt={`${retailer.name} Logo`}
                className="h-10 w-auto"
              />
            ) : retailerId === 'heb' ? (
              <img 
                src={hebLogo} 
                alt={`${retailer.name} Logo`}
                className="h-10 w-auto"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{
                backgroundColor: retailer.theme.primary,
              }}>
                {retailer.shortName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg leading-none">{retailer.name}</h1>
              <p className="text-xs opacity-60">{retailer.tagline}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          {showNav && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    color: isActive(item.path) ? retailer.theme.primary : retailer.theme.text,
                    backgroundColor: isActive(item.path) ? `${retailer.theme.primary}15` : 'transparent',
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t shadow-lg" style={{
          backgroundColor: retailer.theme.background,
          borderTopColor: `${retailer.theme.primary}20`,
        }}>
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all"
                style={{
                  color: isActive(item.path) ? retailer.theme.primary : retailer.theme.text,
                }}
              >
                <item.icon 
                  className="w-6 h-6" 
                  style={{
                    strokeWidth: isActive(item.path) ? 2.5 : 2,
                  }}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
