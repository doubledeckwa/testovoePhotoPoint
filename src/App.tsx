import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'

const Catalog = lazy(() => import('./pages/Catalog'))
const Cart = lazy(() => import('./pages/Cart'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <BrowserRouter basename="/testovoePhotoPoint">
      <Layout>
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App
