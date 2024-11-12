import { PriceHistoryItem, Product } from "@/types";

const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

export function extractPrice(...elements: any) {
    for (const element of elements) {
        const priceText = element.text().trim();

        if (priceText) {
            const cleanPrice = priceText.replace(/[^\d.]/g, '');

            let firstPrice;

            if (cleanPrice) {
                firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
            }

            return firstPrice || cleanPrice;
        }
    }

    return '';
}

export function extractCurrency(element: any) {
    const currencyText = element.text().trim().slice(0, 1);
    return currencyText ? currencyText : "";
}

export function extractDescription($: any) {
    const selectors = [
        ".a-unordered-list .a-list-item",
        ".a-expander-content p",
    ];

    const unwantedPatterns = [
        "download Flash Player",
        "service center",
        "call Amazon",
        "return",
        "verification",
        "5 star",
        "4 star",
        "3 star",
        "2 star",
        "1 star",
    ];

    for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 0) {
            const textContent = elements
                .map((_: any, element: any) => $(element).text().trim())
                .get()
                .filter((text: string) => {
                    return !unwantedPatterns.some((pattern) =>
                        text.toLowerCase().includes(pattern.toLowerCase())
                    );
                })
                .join("\n");
            return textContent;
        }
    }

    return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
            highestPrice = priceList[i];
        }
    }

    return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice.price) {
            lowestPrice = priceList[i];
        }
    }

    return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;

    return averagePrice;
}

export const getEmailNotifType = (
    scrapedProduct: Product,
    currentProduct: Product
) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);

    if (scrapedProduct.currentPrice < lowestPrice) {
        return Notification.LOWEST_PRICE as keyof typeof Notification;
    }
    if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
        return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
    }
    if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
        return Notification.THRESHOLD_MET as keyof typeof Notification;
    }

    return null;
};

export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

export const formatDateTime = (dateString: Date | string) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
        month: "short", // abbreviated month name (e.g., 'Oct')
        day: "numeric", // numeric day of the month (e.g., '25')
        year: "numeric", // numeric year (e.g., '2023')
        hour: "numeric", // numeric hour (e.g., '8')
        minute: "numeric", // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const dateDayOptions: Intl.DateTimeFormatOptions = {
        weekday: "short", // abbreviated weekday name (e.g., 'Mon')
        year: "numeric", // numeric year (e.g., '2023')
        month: "2-digit", // abbreviated month name (e.g., 'Oct')
        day: "2-digit", // numeric day of the month (e.g., '25')
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        month: "short", // abbreviated month name (e.g., 'Oct')
        year: "numeric", // numeric year (e.g., '2023')
        day: "numeric", // numeric day of the month (e.g., '25')
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric", // numeric hour (e.g., '8')
        minute: "numeric", // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };

    const dateOfBirthOptions: Intl.DateTimeFormatOptions = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    };

    const formattedDateTime: string = new Date(dateString).toLocaleString(
        "en-US",
        dateTimeOptions
    );

    const formattedDateDay: string = new Date(dateString).toLocaleString(
        "en-US",
        dateDayOptions
    );

    const formattedDate: string = new Date(dateString).toLocaleString(
        "en-US",
        dateOptions
    );

    const formattedTime: string = new Date(dateString).toLocaleString(
        "en-US",
        timeOptions
    );

    const formatteDateOfBirth: string = new Date(dateString).toLocaleString(
        "en-US",
        dateOfBirthOptions
    )

    return {
        dateTime: formattedDateTime,
        dateDay: formattedDateDay,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
        dateOfBirth: formatteDateOfBirth
    };
};


export const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
