import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
    if (!url) {
        throw new Error("URL is required for scraping.");
    }

    const username = process.env.BRIGHT_DATA_USERNAME;
    const password = process.env.BRIGHT_DATA_PASSWORD;

    if (!username || !password) {
        throw new Error("Bright Data credentials are missing. Please ensure the environment variables BRIGHT_DATA_USERNAME and BRIGHT_DATA_PASSWORD are set.");
    }

    const options = {
        host: 'brd.superproxy.io',
        port: 22225,
        auth: {
            username: `${username}-session-${Math.floor(Math.random() * 1000000)}`,
            password: password
        },
        rejectUnauthorized: false
    };

    try {
        const response = await axios.get(url, options);
        if (!response || !response?.data) {
            throw new Error("No response data received.");
        }
        const $ = cheerio.load(response?.data);

        const title = $('#productTitle').text().trim();

        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        const isOutOfStock = !$('#availability .a-size-medium').text().trim()?.toLocaleLowerCase()?.includes('in stock');

        const images =
            $('img#imgBlkFront')?.attr('data-a-dynamic-image') ||
            $('img#landingImage')?.attr('data-a-dynamic-image') ||
            '{}';
        const imageUrls = Object.keys(JSON.parse(images)) || [];

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage')?.text()?.replace(/[-%]/g, "");

        const description = extractDescription($);

        const reviewsCountText = $('#acrCustomerReviewText').text().trim();
        const reviewsCount = reviewsCountText ? parseInt(reviewsCountText.replace(/\D/g, '')) : 0;

        const starsText = $('#acrPopover')?.attr('title') || "";
        const stars = starsText ? parseFloat(starsText.split(" ")[0]) : 0;

        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0] || null,
            imageUrls,
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            reviewsCount,
            stars,
            isOutOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        };
        return data;
    } catch (error: any) {
        console.error(error);
        throw new Error(`Failed to scrape product: ${error?.message}`);
    }
}
