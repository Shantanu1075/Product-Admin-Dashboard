"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ page, limit, total }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));

    router.replace(`${pathname}?${params.toString()}`);
  };

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let number = startPage; number <= endPage; number++) {
    pages.push(number);
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of{" "}
        <strong>{total}</strong>
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => changePage(page - 1)}
          className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => changePage(1)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              1
            </button>

            {startPage > 2 && <span className="px-1">...</span>}
          </>
        )}

        {pages.map((number) => (
          <button
            key={number}
            onClick={() => changePage(number)}
            className={`rounded-md border px-3 py-2 text-sm ${
              number === page
                ? "border-blue-600 bg-blue-600 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1">...</span>}

            <button
              onClick={() => changePage(totalPages)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => changePage(page + 1)}
          className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}