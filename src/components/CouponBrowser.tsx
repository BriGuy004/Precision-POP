import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Command, 
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Coupon {
  id: string;
  title: string;
  description: string;
  image: string;
  expiresAt: string;
  category?: string;
  value: number;
}

interface CouponBrowserProps {
  coupons: Coupon[];
  onSaveCoupon: (coupon: Coupon) => void;
}

const CouponBrowser = ({ coupons, onSaveCoupon }: CouponBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(coupons.map(coupon => 
    coupon.category || "Uncategorized"
  )));
  
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = searchQuery === "" || 
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === null || 
      (coupon.category || "Uncategorized") === activeCategory;
      
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="rounded-full text-xs"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="rounded-full text-xs"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map(coupon => (
            <div 
              key={coupon.id}
              className="glass-card p-3 rounded-lg hover:shadow-md transition-shadow"
              onClick={() => onSaveCoupon(coupon)}
            >
              <div className="aspect-video mb-2 overflow-hidden rounded-md bg-muted">
                <img 
                  src={coupon.image} 
                  alt={coupon.description}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-medium text-sm text-primary">{coupon.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{coupon.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Expires Today
                </span>
                <span className="font-bold text-sm text-green-500">${coupon.value.toFixed(2)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-8 text-center">
            <p className="text-muted-foreground">No coupons found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponBrowser;
