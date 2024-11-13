import Product from "@/lib/models/product.model";
import { connectDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        await connectDB();

        const products = await Product.find();
        if (!products || products.length === 0) {
            return NextResponse.json(
                { message: "No products found." },
                { status: 404 }
            );
        }

        // 1. SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
        await Promise.all(
            products.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(currentProduct?.url);

                if (scrapedProduct) {
                    const updatedPriceHistory: any = [
                        ...currentProduct?.priceHistory,
                        { price: scrapedProduct?.currentPrice },
                    ];

                    const product = {
                        ...scrapedProduct,
                        priceHistory: updatedPriceHistory,
                        lowestPrice: getLowestPrice(updatedPriceHistory),
                        highestPrice: getHighestPrice(updatedPriceHistory),
                        averagePrice: getAveragePrice(updatedPriceHistory),
                    };

                    const updatedProduct = await Product.findOneAndUpdate(
                        { url: scrapedProduct?.url },
                        { ...product },
                        { new: true }
                    );
                    
                    // 2. CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
                    if (updatedProduct) {
                        const notificationType = getEmailNotifType(scrapedProduct, currentProduct);
                        if (notificationType && updatedProduct?.users?.length as number > 0) {
                            const productInfo = {
                                title: updatedProduct.title,
                                url: updatedProduct.url,
                            };

                            const emailContent = generateEmailBody(productInfo, notificationType);
                            const userEmails = updatedProduct?.users?.map(user => user.email) || [];

                            if (userEmails?.length as number > 0) {
                                await sendEmail(emailContent, userEmails);
                            }
                        }
                    }
                }
            })
        );
        return NextResponse.json(
            { message: "Products updated and notifications sent successfully." },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(`Error in GET: ${error?.message}`);
        return NextResponse.json(
            { message: `Error occurred: ${error?.message}` },
            { status: 500 }
        );
    }
}
