import { useState, useEffect } from 'react'
import { useStore, Product } from '../store/useStore'
import { MagnifyingGlassIcon, FunnelIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, searchQuery, categoryFilter, setSearchQuery, setCategoryFilter } = useStore()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json()
        setProducts(data)
        
        // Get unique categories
        const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category)))
        setCategories(uniqueCategories as string[])
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">Our Products</h1>
        <p className="text-neutral-600 max-w-3xl">Discover our curated collection of high-quality products. We've selected the best items for you.</p>
      </div>
      
      <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-soft lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by product name or description..."
            className="input w-full py-3 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FunnelIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <select
            className="select w-full appearance-none py-3 pl-10"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full bg-neutral-100 p-6">
            <MagnifyingGlassIcon className="h-12 w-12 text-neutral-400" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900">No products found</h2>
          <p className="mb-4 text-neutral-600">Try adjusting your search or filter to find what you're looking for.</p>
          <button 
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('')
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card group overflow-hidden p-0 transition-all hover:translate-y-[-4px]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 p-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-10 group-hover:opacity-100">
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary transform scale-90 transition-transform group-hover:scale-100"
                  >
                    <ShoppingBagIcon className="mr-2 h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-neutral-900 line-clamp-1" title={product.title}>
                  {product.title}
                </h3>
                <p className="mb-3 text-sm text-neutral-600 line-clamp-2" title={product.description}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-primary-700">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-outline py-1.5 px-3 text-sm md:hidden"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
