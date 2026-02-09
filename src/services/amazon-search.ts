import { Product } from "@/types/product";

interface AmazonSearchParams {
    query: string;
    country?: string;
    page?: string;
}

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const RAPID_API_HOST = process.env.NEXT_PUBLIC_AMAZON_RAPID_API_HOST || "real-time-amazon-data.p.rapidapi.com";

export async function searchAmazonProducts(params: AmazonSearchParams): Promise<Product[]> {
    const { query, country = "US", page = "1" } = params;

    if (!RAPID_API_KEY) {
        console.warn("RapidAPI Key is missing. Returning empty array.");
        return [];
    }
    const url = `https://${RAPID_API_HOST}/search?query=${encodeURIComponent(query)}&country=${country}&page=${page}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST,
            },
        });

        if (!response.ok) {
            console.error("Amazon Search API Error:", response.status, response.statusText);
            return [];
        }

        const data = await response.json();
        console.log("Amazon API Response:", data); // Debug log to see structure

        // Map 'real-time-amazon-data' response structure
        const products = data.data?.products || data.products || [];

        return products.map((item: any) => ({
            asin: item.asin || "",
            product_title: item.product_title || item.title || "Untitled Product",
            product_price: item.product_price || item.price || "$0.00",
            product_original_price: item.product_original_price || item.original_price || "",
            product_star_rating: String(item.product_star_rating || item.rating || "0"),
            product_num_ratings: String(item.product_num_ratings || item.reviews_count || "0"),
            product_image: item.product_photo || item.product_image || item.image_url || "",
            is_prime: item.is_prime || item.is_prime_eligible || false,
            amount_sold: item.sales_volume || "",
            delivery_info: item.delivery || "",
            productStatus: item.badge || "",
            retailer: "Amazon",
        }));

    } catch (error) {
        console.error("Failed to fetch Amazon products:", error);
        return [];
    }
}
