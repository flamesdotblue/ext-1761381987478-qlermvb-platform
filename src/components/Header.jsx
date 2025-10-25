import { ShoppingCart, User, LogOut, Cake } from 'lucide-react'
import { useStore } from '../store/store'

export default function Header() {
  const { state, dispatch, selectors } = useStore()

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-backdrop-blur:bg-white/70 bg-white/80 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" role="navigation" aria-label="Primary">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-200 text-pink-800" aria-hidden="true">
            <Cake />
          </span>
          <a href="#top" className="text-xl font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded">
            Sweet Delights
          </a>
        </div>
        <nav className="flex items-center gap-2" aria-label="User and cart">
          {state.user ? (
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => dispatch({ type: 'OPEN_AUTH' })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-haspopup="dialog"
              aria-controls="auth-modal"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'OPEN_CART' })}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label={`Open cart with ${selectors.cartCount} items`}
            aria-haspopup="dialog"
            aria-controls="cart-drawer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {selectors.cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center" aria-live="polite">
                {selectors.cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
