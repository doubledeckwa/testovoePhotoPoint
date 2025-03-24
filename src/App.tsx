import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'

const Catalog = lazy(() => import('./pages/Catalog').then(module => ({ default: module.Catalog })))
const Cart = lazy(() => import('./pages/Cart').then(module => ({ default: module.Cart })))

function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  )
}

export default App
