import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useStore } from '../store/useStore'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const cart = useStore((state) => state.cart)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const setSearchQuery = useStore((state) => state.setSearchQuery)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-soft">
        <div className="container-custom">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <span className="font-display text-xl font-bold text-neutral-900">E-Store</span>
            </Link>

            {/* Search */}
            <div className="hidden flex-1 max-w-md px-8 lg:block">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="input w-full py-2 pl-10"
                  placeholder="Search products..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <Link
                to="/cart"
                className="group relative flex items-center text-neutral-600 transition-colors hover:text-primary-600"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 py-12 text-neutral-400">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">About Us</h3>
              <p className="mb-4">We offer the best products at competitive prices with excellent customer service.</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-primary-400">Home</Link></li>
                <li><Link to="/cart" className="hover:text-primary-400">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
              <p>Email: info@estore.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 border-t border-neutral-800 pt-8 text-center">
            <p>© {new Date().getFullYear()} E-Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
