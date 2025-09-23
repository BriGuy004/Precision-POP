import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";

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
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-1 py-0 mt-0">
      <div className="flex justify-center mt-0 mb-[2px]">
        <img 
          src="/lovable-uploads/90ab9748-bbf9-4c76-bea3-2294d748f78e.png" 
          alt="H-E-B" 
          className="h-32" 
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search products, categories, or locations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Products grid */}
        <div className="mt-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id.toString()}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  category={product.category}
                  pointsEarned={product.pointsEarned}
                  location={product.location}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found. Try another search term.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Shop;
