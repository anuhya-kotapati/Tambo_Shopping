export interface Product {
    asin: string;
    product_title: string;
    product_price: string;
    product_original_price: string;
    product_star_rating: string;
    product_num_ratings: string;
    product_image: string;
    is_prime: boolean;
    amount_sold: string;
    delivery_info: string;
    productStatus: string;
    retailer: "Amazon" | "Walmart" | "Target" | "BestBuy" | "Costco" | "SamsClub";
}

export interface CartItem extends Product {
    quantity: number;
}
