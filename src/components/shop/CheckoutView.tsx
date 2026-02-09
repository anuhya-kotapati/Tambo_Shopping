"use client";

import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CreditCard, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";

interface CheckoutViewProps {
    onBack: () => void;
}

export function CheckoutView({ onBack }: CheckoutViewProps) {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useShopStore();
    const total = getCartTotal();

    return (
        <div className="h-full flex flex-col bg-background animate-in fade-in duration-300">
            {/* Header */}
            <div className="p-4 md:p-6 border-b flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Checkout
                </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Cart Items List */}
                <div className="flex-1 h-full overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                                <ShoppingBag className="h-12 w-12 opacity-20" />
                                <p>Your cart is empty.</p>
                                <Button variant="outline" onClick={onBack}>Continue Shopping</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.asin} className="flex gap-4 p-4 bg-muted/20 rounded-lg border hover:bg-muted/40 transition-colors">
                                        <div className="relative w-20 h-20 shrink-0 bg-white rounded-md overflow-hidden border">
                                            <Image
                                                src={item.product_image}
                                                alt={item.product_title}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-sm line-clamp-2" title={item.product_title}>
                                                    {item.product_title}
                                                </h3>
                                                <p className="text-sm font-semibold text-primary">{item.product_price}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-2 border rounded-md bg-background">
                                                    <button
                                                        className="px-2 py-0.5 hover:bg-muted"
                                                        onClick={() => updateQuantity(item.asin, Math.max(0, item.quantity - 1))}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        className="px-2 py-0.5 hover:bg-muted"
                                                        onClick={() => updateQuantity(item.asin, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeFromCart(item.asin)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar (Desktop) or Bottom Sheet (Mobile) */}
                <div className="md:w-[320px] bg-muted/30 border-l border-t md:border-t-0 p-6 flex flex-col gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full size-lg gap-2" size="lg" disabled={cart.length === 0}>
                        <CreditCard className="w-4 h-4" />
                        Proceed to Payment
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        Secure checkout powered by Tambo
                    </p>
                </div>
            </div>
        </div>
    );
}
