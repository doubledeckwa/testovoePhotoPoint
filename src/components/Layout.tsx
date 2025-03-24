import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useStore } from "../store/useStore";
import { useTheme } from "../hooks/useTheme";
import { useDebounce } from "../hooks/useDebounce";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const cart = useStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const { theme, toggleTheme } = useTheme();


  const [searchInput, setSearchInput] = useState("");


  const debouncedSearchTerm = useDebounce(searchInput, 300);


  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchQuery]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-white dark:bg-neutral-800 shadow-soft transition-colors duration-200">
        <div className="container-custom">
          <div className="flex h-20 items-center justify-between">

            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <span className="font-display text-xl font-bold text-neutral-900 dark:text-white">
                E-Store
              </span>
            </Link>

            <div className="hidden flex-1 max-w-md px-8 lg:block">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-300" />
                </div>
                <input
                  type="text"
                  className="input w-full py-2 pl-10 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:placeholder-neutral-400"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  aria-label="Search products"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center rounded-full p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>


              <Link
                to="/cart"
                className="group relative flex items-center text-neutral-600 dark:text-neutral-300 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white dark:bg-primary-500">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">{children}</main>

      <footer className="bg-white dark:bg-neutral-800 py-8 shadow-soft-top transition-colors duration-200">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-sm font-bold text-white">E</span>
              </div>
              <span className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                E-Store
              </span>
            </div>

            <div className="text-sm text-neutral-600 dark:text-neutral-300">
              © {new Date().getFullYear()} E-Store. All rights reserved.
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
                aria-label="Visit our Facebook page"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
                aria-label="Visit our Twitter page"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
                aria-label="Visit our Instagram page"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
