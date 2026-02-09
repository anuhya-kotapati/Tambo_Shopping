/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import { searchAmazonProducts } from "@/services/amazon-search";
import { searchBestBuyProducts } from "@/services/bestbuy-search";
import { searchCostcoProducts } from "@/services/costco-search";
import { searchWalmartProducts } from "@/services/walmart-search";
import { searchTargetProducts } from "@/services/target-search";
import { searchSamsClubProducts } from "@/services/samsclub-search";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "amazonProductSearch",
    description: "Search for real products on Amazon using keywords.",
    tool: searchAmazonProducts,
    inputSchema: z.object({
      query: z.string().describe("The search keywords, e.g., 'gaming keyboard'"),
      country: z.string().optional().describe("Country code, default US"),
      page: z.string().optional().describe("Page number, default 1"),
    }),
    outputSchema: z.array(z.any()), // Determine strict schema if possible, using z.any() for now to bypass lint
  },
  {
    name: "bestBuyProductSearch",
    description: "Search for products on Best Buy.",
    tool: searchBestBuyProducts,
    inputSchema: z.object({
      query: z.string().describe("The search keywords"),
    }),
    outputSchema: z.array(z.any()),
  },
  {
    name: "costcoProductSearch",
    description: "Search for products on Costco.",
    tool: searchCostcoProducts,
    inputSchema: z.object({
      query: z.string().describe("The search keywords"),
    }),
    outputSchema: z.array(z.any()),
  },
  {
    name: "walmartProductSearch",
    description: "Search for products on Walmart.",
    tool: searchWalmartProducts,
    inputSchema: z.object({
      query: z.string().describe("The search keywords"),
      page: z.string().optional(),
    }),
    outputSchema: z.array(z.any()),
  },
  {
    name: "targetProductSearch",
    description: "Search for products on Target.",
    tool: searchTargetProducts,
    inputSchema: z.object({
      query: z.string().describe("The search keywords"),
      page: z.string().optional(),
    }),
    outputSchema: z.array(z.any()),
  },
  {
    name: "samsClubProductSearch",
    description: "Search for products on Sam's Club.",
    tool: searchSamsClubProducts,
    inputSchema: z.object({
      query: z.string().describe("The search keywords"),
    }),
    outputSchema: z.array(z.any()),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // Add more components here
];
