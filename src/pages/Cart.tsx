import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { TrashIcon, ArrowLeftIcon, ShoppingBagIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore()
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const incrementQuantity = (id: number, currentQty: number) => {
    updateQuantity(id, Math.min(currentQty + 1, 10))
  }

  const decrementQuantity = (id: number, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-neutral-100 p-6">
          <ShoppingBagIcon className="h-12 w-12 text-neutral-400" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold text-neutral-900">Your cart is empty</h2>
        <p className="mb-8 max-w-md text-neutral-600">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900 sm:text-3xl">Shopping Cart</h1>
        <Link to="/" className="btn-outline flex w-full items-center justify-center space-x-2 sm:w-auto">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white shadow-soft">
            <div className="hidden border-b border-neutral-200 px-6 py-4 sm:grid sm:grid-cols-12">
              <div className="sm:col-span-6">
                <h3 className="text-sm font-medium text-neutral-500">Product</h3>
              </div>
              <div className="sm:col-span-2 text-center">
                <h3 className="text-sm font-medium text-neutral-500">Price</h3>
              </div>
              <div className="sm:col-span-2 text-center">
                <h3 className="text-sm font-medium text-neutral-500">Quantity</h3>
              </div>
              <div className="sm:col-span-2 text-right">
                <h3 className="text-sm font-medium text-neutral-500">Total</h3>
              </div>
            </div>

            <div className="divide-y divide-neutral-200">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12 sm:gap-6 sm:p-6"
                >
                  {/* Product */}
                  <div className="flex gap-4 sm:col-span-6">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 p-2 sm:h-24 sm:w-24">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-medium text-neutral-900 line-clamp-1" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500 line-clamp-2" title={item.description}>
                        {item.description}
                      </p>
                      <div className="mt-auto flex items-center sm:hidden">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-neutral-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price - Mobile */}
                  <div className="flex justify-between sm:hidden">
                    <span className="text-sm text-neutral-500">Price:</span>
                    <span className="font-medium text-neutral-900">${item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Price - Desktop */}
                  <div className="hidden sm:col-span-2 sm:flex sm:items-center sm:justify-center">
                    <span className="font-medium text-neutral-900">${item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity - Mobile */}
                  <div className="flex items-center justify-between sm:hidden">
                    <span className="text-sm text-neutral-500">Quantity:</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => decrementQuantity(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 rounded border border-neutral-300 bg-white text-neutral-500 disabled:opacity-50"
                      >
                        <MinusIcon className="mx-auto h-4 w-4" />
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id, item.quantity)}
                        disabled={item.quantity >= 10}
                        className="h-8 w-8 rounded border border-neutral-300 bg-white text-neutral-500 disabled:opacity-50"
                      >
                        <PlusIcon className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quantity - Desktop */}
                  <div className="hidden sm:col-span-2 sm:flex sm:items-center sm:justify-center">
                    <div className="flex items-center">
                      <button
                        onClick={() => decrementQuantity(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 rounded-l border border-neutral-300 bg-white text-neutral-500 disabled:opacity-50"
                      >
                        <MinusIcon className="mx-auto h-4 w-4" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center border-y border-neutral-300 bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id, item.quantity)}
                        disabled={item.quantity >= 10}
                        className="h-8 w-8 rounded-r border border-neutral-300 bg-white text-neutral-500 disabled:opacity-50"
                      >
                        <PlusIcon className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Total - Mobile */}
                  <div className="flex justify-between sm:hidden">
                    <span className="text-sm text-neutral-500">Total:</span>
                    <span className="font-medium text-primary-700">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  {/* Total - Desktop */}
                  <div className="hidden sm:col-span-2 sm:flex sm:items-center sm:justify-end">
                    <span className="font-medium text-primary-700">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  {/* Remove button - Desktop */}
                  <div className="hidden sm:absolute sm:right-4 sm:top-4 sm:block">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-neutral-200 p-4 sm:p-6">
              <div className="flex justify-end">
                <button 
                  onClick={clearCart}
                  className="btn-outline text-sm text-neutral-600 hover:text-red-600"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-xl bg-white p-6 shadow-soft">
            <div className="pb-4">
              <h2 className="font-display text-lg font-semibold text-neutral-900">Order Summary</h2>
            </div>
            
            <div className="space-y-3 border-b border-neutral-200 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="mb-6 flex justify-between">
                <span className="text-base font-medium text-neutral-900">Total</span>
                <span className="text-xl font-semibold text-primary-700">${total.toFixed(2)}</span>
              </div>
              
              <button className="btn-primary w-full py-3">
                Proceed to Checkout
              </button>
              
              <p className="mt-4 text-center text-xs text-neutral-500">
                Secure checkout powered by Stripe. Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
