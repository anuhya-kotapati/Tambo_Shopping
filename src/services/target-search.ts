import { Product } from "@/types/product";

interface TargetSearchParams {
    query: string;
    page?: string;
}

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const RAPID_API_HOST = process.env.NEXT_PUBLIC_TARGET_RAPID_API_HOST || "target13.p.rapidapi.com";

export async function searchTargetProducts(params: TargetSearchParams): Promise<Product[]> {
    const { query } = params;

    if (!RAPID_API_KEY) return [];

    const url = `https://${RAPID_API_HOST}/products/v2/list?keyword=${encodeURIComponent(query)}&count=20`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST,
            },
        });

        if (!response.ok) {
            console.warn("Target API Error or Not Subscribed:", response.status);
            return [];
        }

        const data = await response.json();
        const products = data.data?.products || [];

        return products.map((item: any) => ({
            asin: String(item.tcin) || "",
            product_title: item.title || "Untitled Product",
            product_price: item.price?.formatted_current_price || "$0.00",
            product_original_price: null,
            product_star_rating: String(item.ratings?.average_rating || "0"),
            product_num_ratings: String(item.ratings?.count || "0"),
            product_image: item.images?.primary_image_url || "",
            is_prime: false,
            amount_sold: "",
            delivery_info: "Target Delivery",
            productStatus: "",
            retailer: "Target",
        }));

    } catch (error) {
        console.warn("Target Search failed:", error);
        return [];
    }
}
