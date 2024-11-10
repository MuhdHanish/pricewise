"use server";

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndSaveProduct(url: string) {
    if (!url) {
        throw new Error("URL is required for scraping.");
    }

    try {
        const product = await scrapeAmazonProduct(url);
        if (!product) return;
        return product;
    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error?.message}`)
    }
};