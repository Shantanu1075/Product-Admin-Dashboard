"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../../../../components/Navbar";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import ProductForm from "../../../../components/ProductForm";
import Loading from "../../../../components/Loading";

import {
  getProductById,
  updateProduct,
} from "../../../../services/productApi";

import {
  applyProductUpdate,
  getAddedProduct,
  isProductDeleted,
  saveAddedProduct,
  saveUpdatedProduct,
} from "../../../../utils/productStorage";

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductContent />
    </ProtectedRoute>
  );
}

function EditProductContent() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        if (isProductDeleted(id)) {
          setError("Product not found.");
          return;
        }

        const addedProduct = getAddedProduct(id);

        if (addedProduct) {
          setProduct(addedProduct);
          return;
        }

        const data = await getProductById(
          id,
          controller.signal
        );

        setProduct(applyProductUpdate(data));
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setError(
          error.response?.status === 404
            ? "Product not found."
            : error.userMessage ||
                "Unable to load product."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => controller.abort();
  }, [id]);

  const handleSubmit = async (values) => {
    if (!product || submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await updateProduct(product.id, values);

      const updatedProduct = {
        ...product,
        ...values,
        ...response,
      };

      if (getAddedProduct(product.id)) {
        saveAddedProduct(updatedProduct);
      } else {
        saveUpdatedProduct(updatedProduct);
      }

      router.replace(`/products/${product.id}`);
    } catch (error) {
      setError(
        error.userMessage || "Unable to update product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update product information.
          </p>
        </div>

        {loading && <Loading text="Loading product..." />}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && product && !error && (
          <>
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </>
        )}
      </main>
    </>
  );
}