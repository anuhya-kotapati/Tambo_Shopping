import { Product } from "@/types/product";

interface BestBuySearchParams {
    query: string;
}

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const RAPID_API_HOST = process.env.NEXT_PUBLIC_BESTBUY_RAPID_API_HOST || "BestBuyraygorodskijV1.p.rapidapi.com";

export async function searchBestBuyProducts(params: BestBuySearchParams): Promise<Product[]> {
    const { query } = params;

    if (!RAPID_API_KEY) return [];

    const url = `https://${RAPID_API_HOST}/products/search?q=${encodeURIComponent(query)}&page=1`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST,
            },
        });

        if (!response.ok) {
            console.warn("BestBuy API Error or Not Subscribed:", response.status);
            return [];
        }

        const data = await response.json();
        const products = data.products || [];

        return products.map((item: any) => ({
            asin: item.sku || "",
            product_title: item.name || "Untitled Product",
            product_price: item.regularPrice ? `$${item.regularPrice}` : "$0.00",
            product_original_price: null,
            product_star_rating: String(item.customerReviewAverage || "0"),
            product_num_ratings: String(item.customerReviewCount || "0"),
            product_image: item.image || item.thumbnailImage || "",
            is_prime: false,
            amount_sold: "",
            delivery_info: "BestBuy Pickup/Ship",
            productStatus: "",
            retailer: "BestBuy",
        }));

    } catch (error) {
        console.warn("BestBuy Search failed:", error);
        return [];
    }
}
