export const API_BASE_URL = "https://dummyjson.com";

export const DEFAULT_PAGE_SIZE = 20;

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const SORT_OPTIONS = [
    {
        value: "",
        label: "Default",
    },
    {
        value: "price-asc",
        label: "Price: Low to High",
    },
    {
        value: "price-desc",
        label: "Price: High to Low",
    },
    {
        value: "rating-desc",
        label: "Rating: High to Low",
    },
    {
        value: "rating-asc",
        label: "Rating: Low to High",
    },
    {
        value: "title-asc",
        label: "Title: A-Z",
    },
    {
        value: "title-desc",
        label: "Title: Z-A",
    },
];

export const SEARCH_DEBOUNCE_MS = 400;