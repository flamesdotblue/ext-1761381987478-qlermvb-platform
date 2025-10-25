import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import CartSidebar from './components/CartSidebar'
import AuthModal from './components/AuthModal'
import CheckoutModal from './components/CheckoutModal'
import { StoreProvider } from './store/store'

function Footer() {
  return (
    <footer className="mt-12 border-t bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900">About Sweet Delights</h3>
          <p className="mt-2 text-sm text-gray-600">Artisanal cakes crafted with premium ingredients. Accessible, responsive, and deliciously designed.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Customer Care</h3>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li><a className="hover:underline focus:outline-none focus:ring-2 focus:ring-pink-400 rounded" href="#">Shipping & Returns</a></li>
            <li><a className="hover:underline focus:outline-none focus:ring-2 focus:ring-pink-400 rounded" href="#">Allergens & Ingredients</a></li>
            <li><a className="hover:underline focus:outline-none focus:ring-2 focus:ring-pink-400 rounded" href="#">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Subscribe</h3>
          <form className="mt-2 flex gap-2" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter subscription">
            <input type="email" placeholder="you@example.com" className="flex-1 rounded-md border-gray-300 focus:border-pink-500 focus:ring-pink-500" aria-label="Email" />
            <button className="px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400">Join</button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-gray-600 py-4">© {new Date().getFullYear()} Sweet Delights. All rights reserved.</div>
    </footer>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <div id="top" className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <ProductGrid />
          <AccessibilityNote />
        </main>
        <Footer />
        <CartSidebar />
        <AuthModal />
        <CheckoutModal />
      </div>
    </StoreProvider>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Celebrate every moment with beautiful, delicious cakes
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              From classic flavors to modern creations, our cakes are crafted to delight. Order online with secure checkout and fast delivery.
            </p>
            <div className="mt-6">
              <a href="#cakes-heading" className="inline-flex items-center px-5 py-3 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400">Shop Cakes</a>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1400&auto=format&fit=crop"
              alt="Assortment of pastel cakes and pastries"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
              loading="eager"
            />
            <div className="absolute -z-10 -top-10 -right-10 w-56 h-56 bg-pink-200 rounded-full blur-3xl opacity-60" aria-hidden="true" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-56 h-56 bg-blue-200 rounded-full blur-3xl opacity-60" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

function AccessibilityNote() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white ring-1 ring-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900">Accessible by design</h3>
          <p className="mt-2 text-sm text-gray-700">
            This site follows WCAG 2.1 AA guidelines with keyboard navigation, proper ARIA attributes, and color contrast for a delightful, inclusive experience.
          </p>
        </div>
      </div>
    </section>
  )
}
