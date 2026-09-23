"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import SearchBar from "../../components/SearchBar";
import ProductFilters from "../../components/ProductFilters";
import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import DeleteModal from "../../components/DeleteModal";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

import { getProducts, deleteProduct } from "../../services/productApi";
import {
  applyLocalMutations,
  saveDeletedProduct,
} from "../../utils/productStorage";

import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SORT_OPTIONS,
} from "../../constants";

import {
  parseLimit,
  parsePage,
  parseSort,
} from "../../utils/urlParams";

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [retry, setRetry] = useState(0);

  const params = new URLSearchParams(queryString);

  const rawPage = params.get("page");
  const rawLimit = params.get("limit");
  const rawSort = params.get("sort");

  const page = parsePage(rawPage);
  const limit = parseLimit(rawLimit);
  const search = params.get("search") || "";
  const category = search ? "" : params.get("category") || "";
  const sort = parseSort(rawSort);

  const loadProducts = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts({
          page,
          limit,
          search,
          category,
          sort,
          signal,
        });

        const result = applyLocalMutations(data.products, data.total, {
          search,
          category,
          page,
          limit,
        });

        setProducts(result.products);
        setTotal(result.total);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setError(
          error.userMessage || "Unable to load products. Please try again."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, limit, search, category, sort]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProducts, retry]);

  // Normalize invalid URL parameters.
  useEffect(() => {
    const currentParams = new URLSearchParams(queryString);

    let changed = false;

    if (rawPage !== null && String(page) !== rawPage) {
      currentParams.set("page", String(page));
      changed = true;
    }

    if (rawLimit !== null && String(limit) !== rawLimit) {
      currentParams.set("limit", String(limit));
      changed = true;
    }

    if (rawSort !== null && rawSort !== sort) {
      if (sort) {
        currentParams.set("sort", sort);
      } else {
        currentParams.delete("sort");
      }

      changed = true;
    }

    if (changed) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${currentParams.toString()}`
      );
    }
  }, [queryString, rawPage, rawLimit, rawSort, page, limit, sort]);

  const handleDelete = async () => {
    if (!selectedProduct || deleteLoading) {
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteProduct(selectedProduct.id);

      // DummyJSON delete is simulated, so save it locally.
      saveDeletedProduct(selectedProduct);

      setProducts((previous) =>
        previous.filter((product) => product.id !== selectedProduct.id)
      );

      setTotal((previous) => Math.max(0, previous - 1));

      setSelectedProduct(null);
    } catch (error) {
      setError(
        error.userMessage || "Unable to delete the product."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateUrlForPage = (newPage) => {
    const params = new URLSearchParams(queryString);

    params.set("page", String(newPage));

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const isEmpty = !loading && !error && products.length === 0;

  const hasInvalidLimit =
    rawLimit !== null &&
    !PAGE_SIZE_OPTIONS.includes(Number(rawLimit));

  const hasInvalidSort =
    rawSort !== null &&
    !SORT_OPTIONS.some((option) => option.value === rawSort);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your product catalog.
            </p>
          </div>

          <Link
            href="/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Product
          </Link>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <SearchBar />

            <ProductFilters />
          </div>

          {search && (
            <p className="mt-3 text-xs text-gray-500">
              Category filtering is disabled during search because
              DummyJSON does not support combining those two operations
              in the assignment flow.
            </p>
          )}

          {hasInvalidLimit && (
            <p className="mt-2 text-xs text-amber-600">
              Invalid page size was corrected to {DEFAULT_PAGE_SIZE}.
            </p>
          )}

          {hasInvalidSort && (
            <p className="mt-2 text-xs text-amber-600">
              Invalid sort value was ignored.
            </p>
          )}
        </div>

        {loading && <Loading text="Loading products..." />}

        {error && !loading && (
          <ErrorMessage
            message={error}
            onRetry={() => setRetry((value) => value + 1)}
          />
        )}

        {isEmpty && (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              onDelete={setSelectedProduct}
            />

            <ProductCard
              products={products}
              onDelete={setSelectedProduct}
            />

            <Pagination
              page={page}
              limit={limit}
              total={total}
            />
          </>
        )}
      </main>

      <DeleteModal
        product={selectedProduct}
        loading={deleteLoading}
        onCancel={() => setSelectedProduct(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}