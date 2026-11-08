import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { LoginPage, SignupPage } from './pages/AuthPages'
import { AccountPage } from './pages/AccountPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CheckoutPage, OrderSuccessPage, OrdersPage } from './pages/CheckoutPages'
import { NotFoundPage } from './pages/NotFoundPage'
import { JourneyPage, JourneyDetail } from './pages/JourneyPages'
import { PacksPage } from './pages/PacksPage'
import { WishlabPage, WishlabMy } from './pages/WishlabPages'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/wishlab" element={<WishlabPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/journey/:id" element={<JourneyDetail />} />
          <Route path="/my-packs" element={<PacksPage />} />
          <Route path="/wishlab/my" element={<WishlabMy />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
