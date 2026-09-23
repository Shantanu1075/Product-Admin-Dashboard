"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, getUser } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/products" className="text-xl font-bold text-gray-900">
          Product Admin
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className={`text-sm font-medium ${
              pathname === "/products"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Products
          </Link>

          {user?.username && (
            <span className="hidden text-sm text-gray-500 sm:block">
              {user.username}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}