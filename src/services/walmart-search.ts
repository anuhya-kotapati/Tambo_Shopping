import { Product } from "@/types/product";

interface WalmartSearchParams {
    query: string;
    page?: string;
}

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
// Using a popular Walmart Data API host
const RAPID_API_HOST = process.env.NEXT_PUBLIC_WALMART_RAPID_API_HOST || "walmart28.p.rapidapi.com";

export async function searchWalmartProducts(params: WalmartSearchParams): Promise<Product[]> {
    const { query, page = "1" } = params;

    if (!RAPID_API_KEY) {
        return [];
    }

    // Endpoint structure based on common RapidAPI Walmart APIs
    const url = `https://${RAPID_API_HOST}/search?query=${encodeURIComponent(query)}&page=${page}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST,
            },
        });

        if (!response.ok) {
            // Silently fail if not subscribed
            console.warn("Walmart API Error or Not Subscribed:", response.status);
            return [];
        }

        const data = await response.json();
        const products = data.items || data.products || [];

        return products.map((item: any) => ({
            asin: item.id || String(item.usItemId) || "", // Walmart ID
            product_title: item.name || item.title || "Untitled Product",
            product_price: item.price?.current_price ? `$${item.price.current_price}` : (item.price || "$0.00"),
            product_original_price: null,
            product_star_rating: String(item.rating || "0"),
            product_num_ratings: String(item.reviews_count || "0"),
            product_image: item.image || item.thumbnail || "",
            is_prime: false, // Walmart+ logic could go here
            amount_sold: "",
            delivery_info: "Walmart Delivery",
            productStatus: "",
            retailer: "Walmart",
        }));

    } catch (error) {
        console.warn("Walmart Search failed (likely API key permissions):", error);
        return [];
    }
}
