import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area"; // We might need to implement this or use div
import { Separator } from "@/components/ui/separator"; // We might need to implement this or use div
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export function CartSidebar() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useShopStore();
    const total = getCartTotal();

    if (cart.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground border-l bg-muted/10">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Your cart is empty</h3>
                <p className="text-sm">Start adding items to see them here.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col border-l bg-background shadow-xl">
            <div className="p-4 border-b flex justify-between items-center bg-card">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
                    Clear
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => (
                    <div key={item.asin} className="flex gap-4 p-3 bg-card rounded-lg border shadow-sm transition-all hover:shadow-md">
                        <div className="relative w-16 h-16 bg-white shrink-0 rounded-md overflow-hidden border">
                            <Image
                                src={item.product_image}
                                alt={item.product_title}
                                fill
                                className="object-contain p-1"
                            />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-medium line-clamp-1" title={item.product_title}>
                                    {item.product_title}
                                </h4>
                                <p className="text-sm font-bold text-primary mt-1">{item.product_price}</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 bg-muted rounded-md border">
                                    <button
                                        className="p-1 hover:bg-background rounded-l-md transition-colors disabled:opacity-50"
                                        onClick={() => updateQuantity(item.asin, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                    <button
                                        className="p-1 hover:bg-background rounded-r-md transition-colors"
                                        onClick={() => updateQuantity(item.asin, item.quantity + 1)}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeFromCart(item.asin)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t bg-card mt-auto">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
                <Button className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all" size="lg">
                    Checkout
                </Button>
            </div>
        </div>
    );
}
