import { Product } from "@/types/product";
import { useShopStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addToCart = useShopStore((state) => state.addToCart);

    // Parse rating to number for display
    const rating = parseFloat(product.product_star_rating) || 0;

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative pt-[70%] w-full bg-white overflow-hidden group">
                <Image
                    src={product.product_image}
                    alt={product.product_title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
                {/* Retailer Badge */}
                <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm
                    ${product.retailer === 'Amazon' ? 'bg-[#FF9900]' :
                        product.retailer === 'Walmart' ? 'bg-[#0071DC]' :
                            product.retailer === 'Target' ? 'bg-[#CC0000]' :
                                product.retailer === 'BestBuy' ? 'bg-[#0046BE]' :
                                    product.retailer === 'Costco' ? 'bg-[#E31837]' :
                                        product.retailer === 'SamsClub' ? 'bg-[#004B8D]' : 'bg-gray-500'}`
                }>
                    {product.retailer || "Store"}
                </div>
                {product.is_prime && (
                    <div className="absolute top-2 right-2 bg-[#00A8E1] text-white text-xs font-bold px-2 py-1 rounded">
                        Prime
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm font-medium line-clamp-2 min-h-10 leading-snug" title={product.product_title}>
                        {product.product_title}
                    </CardTitle>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{product.product_star_rating} ({product.product_num_ratings})</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">{product.product_price}</span>
                        {product.product_original_price && (
                            <span className="text-xs text-muted-foreground line-through">
                                {product.product_original_price}
                            </span>
                        )}
                    </div>
                    {product.productStatus && (
                        <p className="text-xs text-green-600 font-medium mt-1">{product.productStatus}</p>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full gap-2 group-hover:bg-primary/90"
                    onClick={() => addToCart(product)}
                    size="sm"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
