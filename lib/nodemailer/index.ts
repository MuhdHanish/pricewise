import { EmailContent, EmailProductInfo, NotificationType } from "@/types";
import nodemailer from "nodemailer";

export const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
};

export const generateEmailBody = (product: EmailProductInfo, type: NotificationType) => {
    const THRESHOLD_PERCENTAGE = 40;
    const shortenedTitle = product?.title?.length > 20
        ? `${product?.title.substring(0, 20)}...`
        : product?.title;

    const fontFamily = "'Space Grotesk', Arial, sans-serif";
    const baseStyle = `font-family: ${fontFamily}; color: #333; line-height: 1.5;`;

    const priceWisePriceStyle = `font-weight: bold; color: #333;`; 
    const priceWiseWiseStyle = `font-weight: bold; color: #E43030;`; 

    const priceWiseText = `<span style="${priceWisePriceStyle}">Price</span><span style="${priceWiseWiseStyle}">Wise</span>`;

    let subject = '';
    let body = '';

    switch (type) {
        case Notification.WELCOME:
            subject = `Welcome to PriseWise – Your Personal Price Tracker`;
            body = `
                <div style="${baseStyle}">
                    <h2 style="font-size: 24px; color: #333;">Welcome to ${priceWiseText} 🚀</h2>
                    <p>You're now tracking <strong>${product?.title}</strong>.</p>
                    <p>Here's a sample of the updates you'll receive:</p>
                    <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
                        <h3 style="font-size: 18px; color: #333;">${product?.title} is back in stock!</h3>
                        <p>We're excited to let you know that <strong>${product?.title}</strong> is now back in stock.</p>
                        <p>Don't miss out - <a href="${product?.url}" style="color: #E43030;" rel="noopener noreferrer">buy it now</a>!</p>
                        <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
                    </div>
                    <p>Stay tuned for more updates on <strong>${shortenedTitle}</strong> and other products you're tracking.</p>
                    <p>- The ${priceWiseText} Team</p>
                </div>
            `;
            break;

        case Notification.CHANGE_OF_STOCK:
            subject = `Stock Update for ${shortenedTitle}`;
            body = `
                <div style="${baseStyle}">
                    <h4 style="font-size: 20px; color: #333;">Good news!</h4>
                    <p><strong>${shortenedTitle}</strong> is back in stock! Grab it before it sells out again.</p>
                    <p><a href="${product?.url}" style="color: #E43030;">View Product</a></p>
                    <p>- The ${priceWiseText} Team</p>
                </div>
            `;
            break;

        case Notification.LOWEST_PRICE:
            subject = `Lowest Price Alert for ${shortenedTitle}`;
            body = `
                <div style="${baseStyle}">
                    <h4 style="font-size: 20px; color: #333;">Congratulations!</h4>
                    <p><strong>${shortenedTitle}</strong> has reached its lowest price yet!</p>
                    <p>Get it now from <a href="${product?.url}" style="color: #E43030;">here</a>.</p>
                    <p>Happy shopping! - The ${priceWiseText} Team</p>
                </div>
            `;
            break;

        case Notification.THRESHOLD_MET:
            subject = `Price Threshold Met for ${shortenedTitle}`;
            body = `
                <div style="${baseStyle}">
                    <h4 style="font-size: 20px; color: #333;">Alert!</h4>
                    <p><strong>${shortenedTitle}</strong> is now discounted by more than ${THRESHOLD_PERCENTAGE}%!</p>
                    <p>Act fast and <a href="${product?.url}" style="color: #E43030;">get it now</a>.</p>
                    <p>- The ${priceWiseText} Team</p>
                </div>
            `;
            break;

        default:
            subject = `Notification from PriseWise`;
            body = `
                <div style="${baseStyle}">
                    <h4 style="font-size: 20px; color: #333;">Hello!</h4>
                    <p>You have a new notification regarding your tracked products.</p>
                    <p>Log in to your ${priceWiseText} account for more details.</p>
                    <p>- The ${priceWiseText} Team</p>
                </div>
            `;
            break;
    }

    return { subject, body };
};

if (!process.env.AUTH || !process.env.PASSWORD) {
    throw new Error("Email credentials are missing. Please ensure the environment variables AUTH and PASSWORD are set.");
}

const transporter = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    port: 2525,
    auth: {
        user: process.env.AUTH,
        pass: process.env.PASSWORD
    },
    maxConnections: 1
});

export const sendEmail = async (emailContent: EmailContent, sendTO: string[]) => {
    const mailOptions = {
        from: process.env.AUTH,
        to: sendTO,
        html: emailContent?.body,
        subject: emailContent?.subject
    };

    try {
       await transporter.sendMail(mailOptions);
    } catch (error: any) {
        throw new Error(error?.message || "Unexpected error while sending email.");
    }
};