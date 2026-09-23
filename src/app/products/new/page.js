"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProductForm from "../../../components/ProductForm";

import { createProduct } from "../../../services/productApi";
import { saveAddedProduct } from "../../../utils/productStorage";

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <NewProductContent />
    </ProtectedRoute>
  );
}

function NewProductContent() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (product) => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const createdProduct = await createProduct(product);

      const finalProduct = {
        ...product,
        ...createdProduct,
      };

      saveAddedProduct(finalProduct);

      router.replace(`/products/${finalProduct.id}`);
    } catch (error) {
      setError(
        error.userMessage || "Unable to create product."
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
            Add Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new product.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <ProductForm
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </main>
    </>
  );
}