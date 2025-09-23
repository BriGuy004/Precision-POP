
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  pointsEarned: number;
  isFeatured?: boolean;
  location?: string; // New prop for store location
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  pointsEarned,
  isFeatured = false,
  location = "Aisle 4", // Default location for demo purposes
}: ProductCardProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  return (
    <motion.div
      className={cn(
        "group relative h-full overflow-hidden rounded-lg glass-card flex flex-col",
        isFeatured && "border-primary/20"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {/* Discount tag */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {discount}% OFF
        </div>
      )}
      
      {/* Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col p-2">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{category}</p>
          <h3 className="text-sm font-medium mt-0.5 line-clamp-2">{name}</h3>
        </div>
        
        <div className="mt-2 flex justify-between items-end">
          <div>
            <div className="flex items-baseline gap-1">
              <p className="text-base font-semibold">${price.toFixed(2)}</p>
              {originalPrice && (
                <p className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</p>
              )}
            </div>
          </div>
          
          {/* Store location info replacing the heart and cart buttons */}
          <div className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
