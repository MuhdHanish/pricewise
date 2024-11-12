"use server";

import { Product as TProduct, User } from "@/types";
import Product from "../models/product.model";
import { connectDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";
import { generateEmailBody, sendEmail } from "../nodemailer";

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
        revalidatePath(`/product/${newProduct?._id}`);
    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error?.message}`)
    } 
};

export async function getProductById(productId: string) {
    try {
        connectDB();
        const product = await Product.findById(productId);
        return product ? JSON.parse(JSON.stringify(product)) : null;
    } catch (error: any) {
        throw new Error(`Failed to fetch product by id: ${error?.message}`)
    } 
};

export async function getAllProducts() {
    try {
        connectDB();
        const products = await Product.find();
        return products;
    } catch (error: any) {
        throw new Error(`Failed to fetch all products: ${error?.message}`)
    } 
};

export async function getSimilarProducts(productId:string): Promise<TProduct[] | null> {
    try {
        connectDB();
        const currentProduct = await Product.findById(productId);
        if (!currentProduct) return null;
        const similarProducts = await Product.find({ _id: { $ne: productId } }).limit(3);
        return similarProducts?.length ? JSON.parse(JSON.stringify(similarProducts)) : [];
    } catch (error: any) {
        throw new Error(`Failed to fetch similar products: ${error?.message}`)
    }
};

export async function addUserEmailToProduct(email: string, productId: string) {
    try {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailPattern.test(email);
        if (!isValid) throw new Error('Provided email is not valid.');
        const product = await Product.findById(productId);
        if (!product) throw new Error('No product found with this id.');
        const userExists = product?.users?.some((user: User) => user?.email === email);
        if (userExists) return;
        product?.users?.push({ email });
        await product.save();
        const emailContent = generateEmailBody(product, "WELCOME");
        await sendEmail(emailContent, [email]);
        revalidatePath(`/product/${productId}`);
    } catch (error: any) {
        throw new Error(`Failed to add user email to product: ${error?.message}`)
    }
}