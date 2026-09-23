"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  thumbnail: "",
};

export default function ProductForm({
  initialData = null,
  onSubmit,
  submitting = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialData) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "",
      price: initialData.price ?? "",
      stock: initialData.stock ?? "",
      thumbnail:
        initialData.thumbnail || initialData.images?.[0] || "",
    });
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (form.price === "" || Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      newErrors.stock = "Stock must be a non-negative integer.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      thumbnail: form.thumbnail.trim(),
    });
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Product title"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="Product description"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              placeholder="smartphones"
            />

            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Image URL
            </label>

            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Price
            </label>

            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="99.99"
            />

            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock
            </label>

            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
              placeholder="20"
            />

            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}