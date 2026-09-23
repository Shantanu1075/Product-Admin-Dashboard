"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import DeleteModal from "../../../components/DeleteModal";

import {
  getProductById,
  deleteProduct,
} from "../../../services/productApi";

import {
  applyProductUpdate,
  getAddedProduct,
  isProductDeleted,
  saveDeletedProduct,
} from "../../../utils/productStorage";

export default function ProductDetailsPage() {
  return (
    <ProtectedRoute>
      <ProductDetailsContent />
    </ProtectedRoute>
  );
}

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

        const localProduct = getAddedProduct(id);

        if (localProduct) {
          setProduct(localProduct);
          return;
        }

        const data = await getProductById(id, controller.signal);

        setProduct(applyProductUpdate(data));
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        if (error.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError(
            error.userMessage ||
              "Unable to load product details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    if (!product || deleteLoading) {
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteProduct(product.id);

      saveDeletedProduct(product);

      router.replace("/products");
    } catch (error) {
      setError(
        error.userMessage || "Unable to delete product."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading && <Loading text="Loading product..." />}

        {!loading && error && (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Products
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/products"
                className="text-sm text-blue-600 hover:underline"
              >
                ← Back to products
              </Link>

              <div className="flex gap-3">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Edit
                </Link>

                <button
                  onClick={() => setDeleteOpen(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="overflow-hidden rounded-2xl border bg-white">
                  <img
                    src={
                      product.images?.[0] ||
                      product.thumbnail
                    }
                    alt={product.title}
                    className="aspect-square w-full object-contain p-8"
                  />
                </div>

                {product.images?.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {product.images.slice(0, 4).map((image) => (
                      <div
                        key={image}
                        className="overflow-hidden rounded-lg border bg-white"
                      >
                        <img
                          src={image}
                          alt={product.title}
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm capitalize text-blue-600">
                  {product.category}
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    ⭐ {product.rating}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    Stock: {product.stock}
                  </span>
                </div>

                <p className="mt-6 text-3xl font-bold">
                  ${Number(product.price).toFixed(2)}
                </p>

                <p className="mt-6 leading-7 text-gray-600">
                  {product.description}
                </p>

                {product.brand && (
                  <p className="mt-4 text-sm text-gray-600">
                    Brand:{" "}
                    <span className="font-medium text-gray-900">
                      {product.brand}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Reviews
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {product.reviews?.length ? (
                  product.reviews.map((review, index) => (
                    <div
                      key={`${review.reviewerEmail}-${index}`}
                      className="rounded-xl border bg-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {review.reviewerName}
                        </p>

                        <span>
                          ⭐ {review.rating}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No reviews available.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <DeleteModal
        product={deleteOpen ? product : null}
        loading={deleteLoading}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}