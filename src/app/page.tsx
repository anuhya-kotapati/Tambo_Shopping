"use client";

import { useState, useCallback } from "react";
import scoutData from "@/scout-data.json";
import { searchAmazonProducts } from "@/services/amazon-search";
import { shoppingAgent } from "@/services/shopping-agent";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartSidebar } from "@/components/shop/CartSidebar";
import { PromptInterface } from "@/components/shop/PromptInterface";
import { WelcomeMessage } from "@/components/shop/WelcomeMessage";
import { CheckoutView } from "@/components/shop/CheckoutView";
import { Product } from "@/types/product";

// Cast the data to the correct type since JSON import might be loose
const allProducts = scoutData.products as unknown as Product[];

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isWelcome, setIsWelcome] = useState(true);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    const lowerQuery = query.toLowerCase().trim();

    if (!query.trim()) return;

    // Detect Intent
    const intent = shoppingAgent.parseQuery(query);

    if (intent.type === "RESET") {
      setIsWelcome(true);
      setIsCheckout(false);
      setFilteredProducts([]);
      return;
    }

    if (intent.type === "CHECKOUT") {
      setIsCheckout(true);
      setIsWelcome(false);
      return;
    }

    // Default: SEARCH
    setIsWelcome(false);
    setIsCheckout(false);
    setIsLoading(true);

    try {
      // Use the Smart Shopping Agent
      const products = await shoppingAgent.processRequest(query);
      setFilteredProducts(products);
    } catch (error) {
      console.error("Search failed:", error);
      // Optional: Show error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="flex min-h-screen w-full bg-background flex-col md:flex-row md:h-screen md:overflow-hidden">
      {/* Main Product Area - Left/Top */}
      <div className="flex-1 flex flex-col relative w-full h-auto md:h-full md:overflow-hidden">
        <header className="sticky top-0 md:absolute md:top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-2xl font-bold tracking-tight text-primary/80 backdrop-blur-sm bg-background/30 rounded-lg px-2">Tambo Store</h1>
          </div>
        </header>

        {isCheckout ? (
          <CheckoutView onBack={() => setIsCheckout(false)} />
        ) : isWelcome ? (
          <div className="min-h-[50vh] flex flex-col">
            <WelcomeMessage />
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="pt-20 md:h-full md:overflow-y-auto">
            <ProductGrid products={filteredProducts} />
          </div>
        )}
      </div>

      {/* Sidebar Area - Right/Bottom */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col border-t md:border-t-0 md:border-l shrink-0 transition-all duration-300 z-20 bg-background/80 backdrop-blur-xl md:h-full">

        {/* Cart Section - Hide in checkout */}
        {!isCheckout && (
          <div className="flex-1 overflow-hidden border-b min-h-0">
            <CartSidebar />
          </div>
        )}

        {/* Prompt Section - Expand in checkout */}
        <div className={`${isCheckout ? "flex-1 h-full" : "shrink-0 min-h-[250px] md:h-auto"} bg-muted/30 transition-all duration-300`}>
          <PromptInterface onSearch={handleSearch} variant={isCheckout ? "checkout" : "search"} />
        </div>
      </div>
    </main>
  );
}
