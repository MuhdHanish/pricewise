"use client";

import { scrapeAndSaveProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

const isValidAmazoneProductURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;
        if (
            hostname?.includes('amazon.com') ||
            hostname?.includes('amazon.') ||
            hostname?.endsWith('amazon')
        ) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const SearchBar = () => {
    const router = useRouter();
    const [loading, startLoading] = useTransition();
    const [searchPrompt, setSearchPrompt] = useState("");
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchPrompt) {
            const isValidPrompt = isValidAmazoneProductURL(searchPrompt);
            if (!isValidPrompt) return toast.warning(`Please enter a valid Amazon product link.`);
            startLoading(async () => {
                try {
                    const product = await scrapeAndSaveProduct(searchPrompt);
                    product && router.push(`/product/${product?._id}`);
                } catch (error) {
                    toast.error(`Something went wrong, please try again.`);
                }
            });
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 mt-12"
        >
            <input
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                className="searchbar-input"
                placeholder="Amazon Product Link"
                type="text"
                disabled={loading}
            />
            <button
                disabled={loading || !searchPrompt}
                type="submit"
                className="searchbar-btn"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
};
