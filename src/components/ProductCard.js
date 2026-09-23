import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return (
    <div className="grid gap-4 md:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex gap-4">
            <img
              src={product.thumbnail || product.images?.[0]}
              alt={product.title}
              className="h-24 w-24 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${product.id}`}
                className="font-semibold text-gray-900"
              >
                {product.title}
              </Link>

              <p className="mt-1 text-sm capitalize text-gray-500">
                {product.category}
              </p>

              <p className="mt-2 font-semibold">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-sm">
            <div>
              <span className="text-gray-500">Rating</span>
              <p>⭐ {product.rating}</p>
            </div>

            <div>
              <span className="text-gray-500">Stock</span>
              <p>{product.stock}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 border-t pt-4 text-sm">
            <Link
              href={`/products/${product.id}`}
              className="text-blue-600"
            >
              View
            </Link>

            <Link
              href={`/products/${product.id}/edit`}
              className="text-gray-700"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(product)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}