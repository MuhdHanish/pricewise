"use client";

export const SearchBar = () => {
    const handleSubmit = () => { };
    return (
        <form
            onClick={handleSubmit}
            className="flex flex-wrap gap-4 mt-12"
        >
            <input
                className="searchbar-input"
                placeholder="Product Link"
                type="text"
            />
            <button
                type="submit"
                className="searchbar-btn"
            >
                Search
            </button>
        </form>
    );
};
