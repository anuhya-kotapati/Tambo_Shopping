"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Send, LifeBuoy } from "lucide-react";

interface PromptInterfaceProps {
    onSearch: (query: string) => void;
    variant?: "search" | "checkout";
}

export function PromptInterface({ onSearch, variant = "search" }: PromptInterfaceProps) {
    const [query, setQuery] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const isCheckout = variant === "checkout";

    return (
        <div className={`w-full h-full flex flex-col p-4 relative overflow-hidden bg-gradient-to-b from-background to-muted/20 ${isCheckout ? "justify-end pb-8" : "justify-center"}`}>
            {/* Decorative elements - reduced size/opacity */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {!isCheckout && (
                <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            )}

            <div className={`flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto z-10 w-full ${isCheckout ? "mb-4" : ""}`}>
                <div className={`hidden md:flex w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center ${isCheckout ? "" : "rotate-3 transition-transform hover:rotate-6"} mb-2`}>
                    {isCheckout ? (
                        <LifeBuoy className="w-8 h-8 text-primary" />
                    ) : (
                        <Sparkles className="w-8 h-8 text-primary" />
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        {isCheckout ? "How can I help?" : "What are you looking for?"}
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto hidden sm:block">
                        {isCheckout
                            ? "Ask me to modify your cart, add a promo code, or find related items."
                            : "Describe what you need, and our AI will help you find the perfect match."
                        }
                    </p>
                </div>

                <div className="w-full max-w-lg relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500" />
                    <form className="relative flex gap-2 bg-background p-1.5 rounded-lg border shadow-sm" onSubmit={handleSubmit}>
                        <Input
                            placeholder={isCheckout ? "E.g., 'Add a warranty', 'Clear cart'" : "E.g., 'A mechanical keyboard under $100'"}
                            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-sm md:text-base h-10 md:h-11"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                        />
                        <Button type="submit" size="icon" className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-md">
                            <Send className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                    </form>
                </div>

                {!isCheckout && (
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                        {["Gaming Keyboards", "Ergonomic Mice", "Wireless Headsets"].map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-muted hover:bg-muted/80 text-[10px] md:text-xs rounded-full cursor-pointer transition-colors border"
                                onClick={() => {
                                    setQuery(tag);
                                    onSearch(tag);
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className={`pt-4 text-center hidden md:block ${isCheckout ? "mt-2" : "md:mt-auto"}`}>
                <p className="text-[10px] text-muted-foreground">
                    Powered by Tambo AI
                </p>
            </div>
        </div>
    );
}
