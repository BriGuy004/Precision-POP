import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useRetailer } from "@/contexts/RetailerContext";

// Sample product data with location information
const products = [
  {
    id: 1,
    name: "Organic Bananas",
    price: 1.99,
    image: "/placeholder.svg",
    category: "produce",
    pointsEarned: 10,
    location: "Produce Aisle 3"
  },
  {
    id: 2,
    name: "Whole Milk",
    price: 3.49,
    image: "/placeholder.svg",
    category: "dairy",
    originalPrice: 4.49,
    pointsEarned: 15,
    location: "Dairy Aisle 7"
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    price: 2.99,
    image: "/placeholder.svg",
    category: "bakery",
    originalPrice: 3.29,
    pointsEarned: 12,
    location: "Bakery Aisle 2"
  },
  {
    id: 4,
    name: "Chicken Breast",
    price: 5.99,
    image: "/placeholder.svg",
    category: "meat",
    originalPrice: 6.99,
    pointsEarned: 25,
    location: "Meat Section 8"
  },
  {
    id: 5,
    name: "Avocados",
    price: 2.49,
    image: "/placeholder.svg",
    category: "produce",
    pointsEarned: 8,
    location: "Produce Aisle 3"
  },
  {
    id: 6,
    name: "Greek Yogurt",
    price: 4.99,
    image: "/placeholder.svg",
    category: "dairy",
    originalPrice: 6.49,
    pointsEarned: 20,
    location: "Dairy Aisle 7"
  }
];

const Shop = () => {
  const { retailer } = useRetailer();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-4">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src={retailer.logo}
              alt={retailer.name}
              className="h-12 w-auto"
            />
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-white/10 bg-white/5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </Button>
          </div>

          {/* Store Locator */}
          <button className="flex items-center gap-2 text-sm text-white/60 mt-3 hover:text-white transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Shopping at: Downtown Store</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-4">
        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  id={product.id.toString()}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  category={product.category}
                  pointsEarned={product.pointsEarned}
                  location={product.location}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/40">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
