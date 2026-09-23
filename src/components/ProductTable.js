import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />

                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {product.title}
                    </Link>
                  </div>
                </td>

                <td className="px-5 py-4 capitalize text-gray-600">
                  {product.category}
                </td>

                <td className="px-5 py-4 font-medium">
                  ${Number(product.price).toFixed(2)}
                </td>

                <td className="px-5 py-4">
                  ⭐ {product.rating}
                </td>

                <td className="px-5 py-4">{product.stock}</td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/products/${product.id}/edit`}
                      className="text-gray-700 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => onDelete(product)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}