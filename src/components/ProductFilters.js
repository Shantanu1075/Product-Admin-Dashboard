"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
} from "../constants";
import { getCategories } from "../services/productApi";

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const limit = Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE;

  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        setCategoryError("");

        const data = await getCategories(controller.signal);

        const normalized = data.map((item) => {
          if (typeof item === "string") {
            return {
              slug: item,
              name: item,
            };
          }

          return {
            slug: item.slug,
            name: item.name,
          };
        });

        setCategories(normalized);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setCategoryError(error.userMessage || "Failed to load categories.");
      }
    };

    loadCategories();

    return () => controller.abort();
  }, [retry]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Category
        </label>

        <select
          value={search ? "" : category}
          disabled={Boolean(search)}
          onChange={(event) => updateFilter("category", event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">
            {search ? "Disabled during search" : "All categories"}
          </option>

          {!search &&
            categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
        </select>

        {categoryError && !search && (
          <button
            onClick={() => setRetry((value) => value + 1)}
            className="mt-1 block text-xs text-red-600 underline"
          >
            Failed to load. Retry
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Sort
        </label>

        <select
          value={sort}
          onChange={(event) => updateFilter("sort", event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Page size
        </label>

        <select
          value={limit}
          onChange={(event) => updateFilter("limit", event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}