import { Product } from "@/types/product";

interface CostcoSearchParams {
    query: string;
}

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const RAPID_API_HOST = process.env.NEXT_PUBLIC_COSTCO_RAPID_API_HOST || "real-time-costco-data.p.rapidapi.com";

export async function searchCostcoProducts(params: CostcoSearchParams): Promise<Product[]> {
    const { query } = params;

    if (!RAPID_API_KEY) return [];

    const url = `https://${RAPID_API_HOST}/search?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST,
            },
        });

        if (!response.ok) {
            console.warn("Costco API Error or Not Subscribed:", response.status);
            return [];
        }

        const data = await response.json();
        const products = data.items || [];

        return products.map((item: any) => ({
            asin: item.productId || "",
            product_title: item.name || "Untitled Product",
            product_price: item.price ? `$${item.price}` : "$0.00",
            product_original_price: null,
            product_star_rating: String(item.rating || "0"),
            product_num_ratings: "0",
            product_image: item.imageUrl || "",
            is_prime: false,
            amount_sold: "",
            delivery_info: "Costco Delivery",
            productStatus: "Members Only",
            retailer: "Costco",
        }));

    } catch (error) {
        console.warn("Costco Search failed:", error);
        return [];
    }
}
