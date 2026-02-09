import { Product } from "@/types/product";
import { searchAmazonProducts } from "./amazon-search";
import { searchBestBuyProducts } from "./bestbuy-search";
import { searchCostcoProducts } from "./costco-search";
import { searchWalmartProducts } from "./walmart-search";
import { searchTargetProducts } from "./target-search";
import { searchSamsClubProducts } from "./samsclub-search";

export type IntentType = "SEARCH" | "RESET" | "CHECKOUT";

export interface SearchIntent {
    type: IntentType;
    originalQuery: string;
    items: string[];
    budget: number | null;
    isBundle: boolean;
}

export class ShoppingAgent {
    /**
     * Detects the intent of the user query.
     */
    detectIntent(query: string): IntentType {
        const lowerQuery = query.toLowerCase();

        const resetKeywords = ["reset", "start over", "beginning", "restart", "clear"];
        if (resetKeywords.some(k => lowerQuery.includes(k))) {
            return "RESET";
        }

        const checkoutKeywords = ["checkout", "cart", "pay", "buy", "purchase", "order"];
        // Check for specific phrases like "show me my cart", "go to checkout", "ready to pay"
        // Simply checking for keywords might be too aggressive if user searches for "cart for groceries"
        // So we look for specific patterns or intent-heavy words combined

        if (
            lowerQuery.includes("checkout") ||
            lowerQuery.includes("pay") ||
            (lowerQuery.includes("cart") && (lowerQuery.includes("show") || lowerQuery.includes("go") || lowerQuery.includes("view") || lowerQuery.includes("my")))
        ) {
            return "CHECKOUT";
        }

        return "SEARCH";
    }

    /**
     * Parses a natural language query to extract items and budget constraints.
     */
    parseQuery(query: string): SearchIntent {
        const intentType = this.detectIntent(query);
        const lowerQuery = query.toLowerCase();

        // 1. Extract Budget
        // Matches: "under $100", "below 50 dollars", "budget of 200"
        let budget: number | null = null;
        const budgetRegex = /(?:under|below|budget|less than)\s*(?:of)?\s*(?:\$|USD|usd)?\s*(\d+(?:\.\d{0,2})?)/;
        const budgetMatch = lowerQuery.match(budgetRegex);

        if (budgetMatch && budgetMatch[1]) {
            budget = parseFloat(budgetMatch[1]);
        }

        // 2. Remove budget text from query to clean it up for item extraction
        const cleanQuery = lowerQuery.replace(budgetRegex, "").trim();

        // 3. Extract Items (simple splitting by common separators)
        // "mouse and keyboard", "mouse, keyboard", "mouse with keyboard"
        const separators = /\s+(?:and|with|plus|\&)\s+|,\s*/;
        const items = cleanQuery
            .split(separators)
            .map(item => item.trim())
            .filter(item => item.length > 0 && !["a", "an", "the"].includes(item)); // Remove articles if they are the only thing? 
        // Actually, be careful not to remove "the" from "the witcher game". 
        // Better to just filter empty strings. 
        // Let's rely on the split.

        return {
            type: intentType,
            originalQuery: query,
            items: items.length > 0 ? items : [cleanQuery],
            budget,
            isBundle: items.length > 1
        };
    }

    /**
     * Helper to parse price string like "$1,234.99" to number
     */
    parsePrice(priceStr: string): number {
        if (!priceStr) return 0;
        // Remove non-numeric chars except dot
        const clean = priceStr.replace(/[^0-9.]/g, "");
        return parseFloat(clean) || 0;
    }

    /**
     * Main entry point to process a user request.
     */
    async processRequest(query: string): Promise<Product[]> {
        const intent = this.parseQuery(query);
        console.log("Shopping Agent Intent:", intent);

        if (intent.isBundle && intent.items.length > 0) {
            return this.searchBundle(intent);
        } else {
            // Single item search
            return this.searchSingleItem(intent);
        }
    }

    private async searchSingleItem(intent: SearchIntent): Promise<Product[]> {
        const query = intent.items[0] || intent.originalQuery;

        // Execute all searches in parallel
        // We use Promise.all to wait for all, but individual services should catch their own errors and return []
        const [amazon, bestbuy, costco, walmart, target, samsclub] = await Promise.all([
            searchAmazonProducts({ query }),
            searchBestBuyProducts({ query }),
            searchCostcoProducts({ query }),
            searchWalmartProducts({ query }),
            searchTargetProducts({ query }),
            searchSamsClubProducts({ query })
        ]);

        const allProducts = [
            ...amazon,
            ...bestbuy,
            ...costco,
            ...walmart,
            ...target,
            ...samsclub
        ];

        // Shuffle results to mix retailers (simple Fisher-Yates shuffle)
        for (let i = allProducts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
        }

        if (intent.budget) {
            return allProducts.filter(p => this.parsePrice(p.product_price) <= intent.budget!);
        }

        return allProducts;
    }

    private async searchBundle(intent: SearchIntent): Promise<Product[]> {
        const { items, budget } = intent;

        // 1. Fetch results for ALL items in parallel
        const searchPromises = items.map(item => searchAmazonProducts({ query: item }));
        const resultsResults = await Promise.all(searchPromises);

        // Flatten initially to see what we have
        // But we need to keep them separated by category to form bundles?
        // The requirement says "fetch all those items under that budget".
        // It implies displaying them.
        // If I return a flat list of products, the UI will just show them.
        // If there is a budget, we should probably filter globally?

        // Strategy:
        // If budget exists:
        // Calculate a "per item" budget guideline? Or just ensure no SINGLE item exceeds the TOTAL budget?
        // Ideally, we want combinations. But creating a "Bundle" UI object is a bigger change.
        // Let's filter items that are clearly too expensive (e.g. > budget).

        let allProducts: Product[] = [];

        resultsResults.forEach((products, index) => {
            const itemTerm = items[index];
            // Filter out items that are individually more expensive than the total budget (logical first step)
            const filtered = budget
                ? products.filter(p => this.parsePrice(p.product_price) <= budget)
                : products;

            // Tag them maybe? (Not in current Product type, can add later)
            console.log(`Found ${filtered.length} items for "${itemTerm}" that fit within budget ${budget}`);
            allProducts = [...allProducts, ...filtered];
        });

        // Advanced: If we really want to enforce "Bundle under budget", we need to select a set.
        // For now, returning all valid candidates is a good step 1.
        // We can sort them by price ascending to help the user fit the budget.

        return allProducts;
    }
}

export const shoppingAgent = new ShoppingAgent();
