import { Routes, Route, Navigate } from 'react-router'
import { I18nProvider } from './i18n'
import { IS_SHOP } from './data/products'
import Home from './pages/Home'
import Store from './pages/Store'
import Showcase from './pages/Showcase'
import Quiz from './pages/Quiz'
import { CheckoutPreview, OrderSuccess } from './pages/CheckoutPages'

export default function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route path="/" element={IS_SHOP ? <Store /> : <Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/quiz/:slug" element={<Quiz />} />
        <Route path="/checkout-preview" element={<CheckoutPreview />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        {/* Bare /quiz and any unknown URL used to render a blank page —
            send them home instead. */}
        <Route path="/quiz" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </I18nProvider>
  )
}
