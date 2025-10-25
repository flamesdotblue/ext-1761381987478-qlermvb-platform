import { X, Plus, Minus, Trash2, ShieldCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useStore } from '../store/store'

export default function CartSidebar() {
  const { state, dispatch, selectors } = useStore()
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)

  // trap focus when open
  useEffect(() => {
    if (state.ui.cartOpen) {
      closeButtonRef.current?.focus()
    }
  }, [state.ui.cartOpen])

  // close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && state.ui.cartOpen) dispatch({ type: 'CLOSE_CART' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.ui.cartOpen, dispatch])

  const items = state.cart.items
  const subtotal = selectors.cartSubtotal

  return (
    <div
      id="cart-drawer"
      role="dialog"
      aria-modal={state.ui.cartOpen}
      aria-label="Shopping cart"
      className={`fixed inset-0 z-50 ${state.ui.cartOpen ? '' : 'pointer-events-none'}`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${state.ui.cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />
      <aside
        ref={panelRef}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 flex flex-col ${state.ui.cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            ref={closeButtonRef}
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Close cart"
          >
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 py-3" aria-live="polite">
          {items.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <img src={it.image} alt="" className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{it.name}</p>
                    <p className="text-sm text-gray-600">${it.price.toFixed(2)}</p>
                    <div className="mt-2 inline-flex items-center gap-2" aria-label={`Quantity controls for ${it.name}`}>
                      <button
                        onClick={() => dispatch({ type: 'SET_QTY', payload: { id: it.id, qty: it.qty - 1 } })}
                        className="p-1 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        aria-label={`Decrease ${it.name} quantity`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[2ch] text-center" aria-live="polite">{it.qty}</span>
                      <button
                        onClick={() => dispatch({ type: 'SET_QTY', payload: { id: it.id, qty: it.qty + 1 } })}
                        className="p-1 rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        aria-label={`Increase ${it.name} quantity`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: it.id })}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                        aria-label={`Remove ${it.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between text-gray-900">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Secure checkout. Taxes and shipping calculated at payment.</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => dispatch({ type: 'OPEN_CHECKOUT' })}
            className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-haspopup="dialog"
            aria-controls="checkout-modal"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </div>
  )
}
