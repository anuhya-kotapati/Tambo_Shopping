import { create } from 'zustand';
import { CartItem, Product } from '@/types/product';

interface ShopState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (asin: string) => void;
    updateQuantity: (asin: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

export const useShopStore = create<ShopState>((set, get) => ({
    cart: [],

    addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.asin === product.asin);

        if (existingItem) {
            set({
                cart: cart.map((item) =>
                    item.asin === product.asin
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
    },

    removeFromCart: (asin) => {
        set((state) => ({
            cart: state.cart.filter((item) => item.asin !== asin),
        }));
    },

    updateQuantity: (asin, quantity) => {
        if (quantity <= 0) {
            get().removeFromCart(asin);
            return;
        }

        set((state) => ({
            cart: state.cart.map((item) =>
                item.asin === asin ? { ...item, quantity } : item
            ),
        }));
    },

    clearCart: () => set({ cart: [] }),

    getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
            const priceString = item.product_price.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceString) || 0;
            return total + price * item.quantity;
        }, 0);
    },
}));
