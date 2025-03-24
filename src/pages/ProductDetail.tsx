import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, Product } from '../store/useStore';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-neutral-100 p-6 dark:bg-neutral-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900 dark:text-white">Product Not Found</h2>
        <p className="mb-8 text-neutral-600 dark:text-neutral-300">{error || 'The product you are looking for does not exist.'}</p>
        <Link to="/" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">

        <div className="aspect-square overflow-hidden rounded-xl bg-white p-8 shadow-soft dark:bg-neutral-800">
          <img 
            src={product.image} 
            alt={product.title} 
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>


        <div>
          <div className="mb-2">
            <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>
          
          <h1 className="mb-4 font-display text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-neutral-950">
            {product.title}
          </h1>
          
          <div className="mb-6">
            <p className="text-3xl font-bold text-primary-700 dark:text-neutral-950">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="mb-8 prose prose-neutral max-w-none dark:prose-invert">
            <p className="dark:text-neutral-300">{product.description}</p>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="btn-primary w-full sm:w-auto"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBagIcon className="mr-2 h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
