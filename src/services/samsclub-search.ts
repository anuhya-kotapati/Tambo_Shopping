import { Product } from "@/types/product";

interface SamsClubSearchParams {
    query: string;
}

// Sam's Club API usually requires specific keys, but we'll structure it 
// so it can be enabled later or if a generic scraper API becomes available.
const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY || "";
const RAPID_API_HOST = "sams-club-scraper.p.rapidapi.com";

export async function searchSamsClubProducts(params: SamsClubSearchParams): Promise<Product[]> {
    const { query } = params;

    if (!RAPID_API_KEY) return [];

    const url = `https://${RAPID_API_HOST}/search/${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPID_API_KEY,
                "x-rapidapi-host": RAPID_API_HOST,
            },
        });

        if (!response.ok) {
            console.warn("Sams Club API Error or Not Subscribed:", response.status);
            return [];
        }

        const data = await response.json();
        const products = data.results || [];

        return products.map((item: any) => ({
            asin: item.productId || "",
            product_title: item.title || "Untitled Product",
            product_price: item.price?.amount ? `$${item.price.amount}` : "$0.00",
            product_original_price: null,
            product_star_rating: String(item.rating || "0"),
            product_num_ratings: String(item.ratingCount || "0"),
            product_image: item.image || "",
            is_prime: false,
            amount_sold: "",
            delivery_info: "Sam's Pickup",
            productStatus: "Members Only",
            retailer: "SamsClub",
        }));

    } catch (error) {
        console.warn("Sams Club Search failed:", error);
        return [];
    }
}
