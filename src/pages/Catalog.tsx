import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { useStore, Product } from '../store/useStore'
import { MagnifyingGlassIcon, FunnelIcon, ShoppingBagIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useDebounce } from '../hooks/useDebounce'
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

interface ProductsResponse {
  products: Product[]
  nextPage: number | undefined
  hasMore: boolean
}

const ProductCard = memo(({ 
  product, 
  onAddToCart, 
  refProp 
}: { 
  product: Product, 
  onAddToCart: (product: Product) => void, 
  refProp: ((node: HTMLDivElement) => void) | undefined 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      ref={refProp}
      className="card group overflow-hidden p-0 transition-all hover:translate-y-[-4px]"
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className="block relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-6">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className={`h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all group-hover:bg-opacity-10 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="btn-primary transform scale-90 transition-transform group-hover:scale-100"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingBagIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              Add to Cart
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/testovoePhotoPoint/product/${product.id}`;
              }}
              className="btn-secondary transform scale-90 transition-transform group-hover:scale-100"
              aria-label={`View details for ${product.title}`}
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 dark:text-white">
        <div className="mb-2">
          <span className="inline-block rounded-full bg-primary-100 dark:bg-primary-900 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:text-primary-300">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </div>
        <h3 
          id={`product-title-${product.id}`} 
          className="mb-1 font-medium text-neutral-900 dark:text-neutral-950 line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer" 
          title={product.title}
          onClick={() => window.location.href = `/testovoePhotoPoint/product/${product.id}`}
        >
          {product.title}
        </h3>
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2" title={product.description}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-primary-700 dark:text-neutral-950">${product.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="btn-outline py-1.5 px-3 text-sm md:hidden dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700"
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
})

// Основной компонент каталога
const Catalog = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastItemRef = useRef<HTMLDivElement | null>(null)
  const { addToCart, searchQuery, categoryFilter, setSearchQuery, setCategoryFilter } = useStore()
  const queryClient = useQueryClient()
  
  // Применяем debounce к локальному поисковому запросу
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

  // Запрос для получения категорий
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('https://fakestoreapi.com/products/categories')
      return response.json()
    },
    staleTime: 1000 * 60 * 10, // 10 минут кэширования
  })

  // Бесконечный запрос для получения продуктов с пагинацией
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<ProductsResponse>({
    queryKey: ['products', categoryFilter],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number
      const limit = 8
      const start = (page - 1) * limit
      
      // Формируем URL с учетом фильтров
      let url = 'https://fakestoreapi.com/products'
      if (categoryFilter) {
        url = `https://fakestoreapi.com/products/category/${categoryFilter}`
      }
      
      const response = await fetch(url)
      const allData = await response.json()
      
      // Имитируем пагинацию на клиенте
      const paginatedData = allData.slice(start, start + limit)
      const hasMore = paginatedData.length === limit
      
      return {
        products: paginatedData,
        nextPage: hasMore ? page + 1 : undefined,
        hasMore
      }
    },
    getNextPageParam: (lastPage: ProductsResponse) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5 минут кэширования
    initialPageParam: 1
  })

  // Обработчик для последнего элемента в списке (бесконечная прокрутка)
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isFetchingNextPage) return
    
    if (observerRef.current) observerRef.current.disconnect()
    lastItemRef.current = node
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, { threshold: 0.5 })
    
    if (node) observerRef.current.observe(node)
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage])

  // Синхронизируем локальный поисковый запрос с глобальным состоянием
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])
  
  // Обновляем глобальное состояние поиска при изменении дебаунсированного значения
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery)
  }, [debouncedSearchQuery, setSearchQuery])
  
  // Сбрасываем кэш при изменении поискового запроса
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }, [searchQuery, queryClient])

  // Мемоизируем отфильтрованные продукты для предотвращения ненужных вычислений
  const filteredProducts = useMemo(() => {
    if (!data?.pages) return []
    
    return data.pages.flatMap((page: ProductsResponse) => page.products).filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesSearch
    })
  }, [data?.pages, searchQuery])

  // Отображаем состояние загрузки
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    )
  }
  
  // Отображаем состояние ошибки
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-red-100 dark:bg-red-900 p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900 dark:text-white">Error Loading Products</h2>
        <p className="mb-8 text-neutral-600 dark:text-neutral-300">There was an error loading the products. Please try again later.</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-neutral-950 mb-2">Our Products</h1>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-3xl">Discover our curated collection of high-quality products. We've selected the best items for you.</p>
      </div>
      
      <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white dark:bg-neutral-800 p-6 shadow-soft lg:flex-row lg:items-center">
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
            {categories.map((category: string) => (
              <option key={category} value={category}>
                {typeof category === 'string' ? category.charAt(0).toUpperCase() + category.slice(1) : category}
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
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              refProp={index === filteredProducts.length - 1 ? lastProductElementRef : undefined}
            />
          ))}
        </div>
      )}
      

      {isFetchingNextPage && (
        <div className="flex justify-center mt-8 py-4" aria-live="polite" aria-busy="true">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400" role="status">
            <span className="sr-only">Loading more products...</span>
          </div>
        </div>
      )}
      
      {!hasNextPage && filteredProducts.length > 0 && (
        <div className="text-center mt-8 py-4 text-neutral-600 dark:text-neutral-300">
          <p>You've reached the end of the results</p>
        </div>
      )}
    </div>
  )
}

export default Catalog
