"use server";

import Product from "../models/product.model";
import { connectDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";

export async function scrapeAndSaveProduct(url: string) {
    if (!url) {
        throw new Error("URL is required for scraping.");
    }

    try {
        let product = await scrapeAmazonProduct(url);
        if (!product) return;

        connectDB();
        const exist = await Product.findOne({ url: product?.url });
        if (exist) {
            const updatedPriceHistory: any = [
                ...exist?.priceHistory,
                { price: product?.currentPrice, }
            ];
            product = {
                ...product,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory)
            };
        }
        const newProduct = await Product.findOneAndUpdate(
            { url: product?.url, },
            { ...product, },
            { upsert: true, new: true }
        );
        revalidatePath(`/products/${newProduct?._id}`);
    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error?.message}`)
    } 
};

export async function getProductById(productId: string) {
    try {
        connectDB();
        const product = await Product.findById(productId);
        return product;
    } catch (error: any) {
        throw new Error(`Failed to fetch product by id: ${error?.message}`)
    } 
};

export async function getAllProducts() {
    try {
        connectDB();
        const products = await Product.find();
        return JSON.parse(JSON.stringify(products));
    } catch (error: any) {
        throw new Error(`Failed to fetch all products: ${error?.message}`)
    } 
};