import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="h-full w-full p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
                {products.map((product) => (
                    <ProductCard key={product.asin} product={product} />
                ))}
            </div>
        </div>
    );
}
