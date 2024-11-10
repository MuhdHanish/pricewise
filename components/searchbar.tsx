"use client";

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
    const [loading, startLoading] = useTransition();
    const [searchPrompt, setSearchPrompt] = useState("");
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchPrompt) {
            const isValidPrompt = isValidAmazoneProductURL(searchPrompt);
            if (!isValidPrompt) return toast.warning(`Please enter a valid Amazon product link.`);
            startLoading(async () => {
                try {
                } catch (error) {
                    console.error(error);
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
