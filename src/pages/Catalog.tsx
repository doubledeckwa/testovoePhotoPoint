import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useStore, Product } from '../store/useStore'
import { MagnifyingGlassIcon, FunnelIcon, ShoppingBagIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '../hooks/useDebounce'

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [initialLoading, setInitialLoading] = useState(true) // Для первоначальной загрузки
  const [loadingMore, setLoadingMore] = useState(false) // Для загрузки следующих страниц
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const observer = useRef<IntersectionObserver | null>(null)
  const { addToCart, searchQuery, categoryFilter, setSearchQuery, setCategoryFilter } = useStore()
  
  // Применяем debounce к локальному поисковому запросу
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  const fetchProducts = useCallback(async (pageNum: number = 1) => {
    try {
      // Устанавливаем соответствующий тип загрузки в зависимости от номера страницы
      if (pageNum === 1) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }
      // Используем ограничение по количеству товаров для имитации пагинации
      // В реальном API обычно есть параметры для пагинации
      const limit = 8
      const start = (pageNum - 1) * limit
      
      // Получаем все продукты для категорий, но для пагинации используем ограничение
      const response = await fetch('https://fakestoreapi.com/products')
      const allData = await response.json()
      
      // Получаем уникальные категории из всех данных
      if (initialLoad) {
        const uniqueCategories = Array.from(new Set(allData.map((p: Product) => p.category)))
        setCategories(uniqueCategories as string[])
        setInitialLoad(false)
      }
      
      // Имитируем пагинацию
      const paginatedData = allData.slice(start, start + limit)
      
      // Если получили меньше элементов, чем запросили, значит больше нет данных
      if (paginatedData.length < limit) {
        setHasMore(false)
      }
      
      setProducts(prev => pageNum === 1 ? paginatedData : [...prev, ...paginatedData])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      // Сбрасываем оба состояния загрузки
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, [initialLoad])

  useEffect(() => {
    // Сбрасываем состояние при изменении фильтров
    setPage(1)
    setHasMore(true)
    setProducts([])
    fetchProducts(1)
  }, [categoryFilter, fetchProducts])
  
  // Инициализируем локальный поисковый запрос из глобального состояния
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])
  
  // Обновляем глобальное состояние поиска при изменении дебаунсированного значения
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setSearchQuery])
  
  // Эффект для поиска - сбрасываем пагинацию при изменении поискового запроса
  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [searchQuery])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })
  
  // Настраиваем Intersection Observer для бесконечного скролла
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (initialLoading || loadingMore) return
    
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !initialLoading) {
        setPage(prevPage => prevPage + 1)
        fetchProducts(page + 1)
      }
    }, { threshold: 0.5 })
    
    if (node) observer.current.observe(node)
  }, [initialLoading, loadingMore, hasMore, fetchProducts, page])

  if (initialLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-neutral-950 mb-2">Our Products</h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-3xl">Discover our curated collection of high-quality products. We've selected the best items for you.</p>
      </div>
      
      <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-soft lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-300" />
          </div>
          <input
            type="text"
            placeholder="Search by product name or description..."
            className="input w-full py-3 pl-10 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:placeholder-neutral-400"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            aria-label="Search by product name or description"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FunnelIcon className="h-5 w-5 text-neutral-400 dark:text-neutral-300" />
          </div>
          <select
            className="select w-full appearance-none py-3 pl-10 dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
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
          <div className="mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 p-6">
            <MagnifyingGlassIcon className="h-12 w-12 text-neutral-400 dark:text-neutral-300" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900 dark:text-white">No products found</h2>
          <p className="mb-4 text-neutral-600 dark:text-neutral-300">Try adjusting your search or filter to find what you're looking for.</p>
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
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={index === filteredProducts.length - 1 ? lastProductElementRef : undefined}
              className="card group overflow-hidden p-0 transition-all hover:translate-y-[-4px]"
              role="article"
              aria-labelledby={`product-title-${product.id}`}
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-10 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="btn-primary transform scale-90 transition-transform group-hover:scale-100"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      <ShoppingBagIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Add to Cart
                    </button>
                    <Link 
                      to={`/product/${product.id}`} 
                      className="btn-secondary transform scale-90 transition-transform group-hover:scale-100"
                      aria-label={`View details for ${product.title}`}
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </Link>
              <div className="p-4 dark:text-white">
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-primary-100 dark:bg-primary-900 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:text-primary-300">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 
                    id={`product-title-${product.id}`} 
                    className="mb-1 font-medium text-neutral-900 dark:text-neutral-950 line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400" 
                    title={product.title}
                  >
                    {product.title}
                  </h3>
                </Link>
                <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2" title={product.description}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-primary-700 dark:text-neutral-950">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-outline py-1.5 px-3 text-sm md:hidden dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700"
                    aria-label={`Add ${product.title} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <div className="flex justify-center mt-8 py-4" aria-live="polite" aria-busy="true">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400" role="status">
            <span className="sr-only">Загрузка дополнительных товаров...</span>
          </div>
        </div>
      )}
      
      {/* End of results message */}
      {!hasMore && filteredProducts.length > 0 && (
        <div className="text-center mt-8 py-4 text-neutral-600 dark:text-neutral-300">
          <p>You've reached the end of the results</p>
        </div>
      )}
    </div>
  )
}

export default Catalog
