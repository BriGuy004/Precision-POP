
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import { RetailerProvider } from "./contexts/RetailerContext";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Coupons = lazy(() => import("./pages/Coupons"));
const Shop = lazy(() => import("./pages/Shop"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RetailerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shopping-list" element={<ShoppingList />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </RetailerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
