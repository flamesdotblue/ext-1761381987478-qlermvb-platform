import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { Lock } from 'lucide-react'

export default function CheckoutModal() {
  const { state, dispatch, selectors } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | success

  const closeRef = useRef(null)

  useEffect(() => {
    if (state.ui.checkoutOpen) closeRef.current?.focus()
  }, [state.ui.checkoutOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && state.ui.checkoutOpen) dispatch({ type: 'CLOSE_CHECKOUT' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.ui.checkoutOpen, dispatch])

  const subtotal = selectors.cartSubtotal

  function validate() {
    if (!name.trim()) return 'Please enter your full name'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email'
    if (!address.trim()) return 'Please enter your address'
    if (!city.trim()) return 'Please enter your city'
    if (!zip.match(/^\d{4,10}$/)) return 'Please enter a valid ZIP / Postal code'
    if (state.cart.items.length === 0) return 'Your cart is empty'
    return ''
  }

  async function handlePay(method) {
    const v = validate()
    if (v) return setError(v)
    setError('')
    setStatus('processing')

    // Frontend-only mock integration. In production, call your Spring Boot backend to create Stripe Checkout Session or PayPal order.
    const stripePk = import.meta.env.VITE_STRIPE_PUBLIC_KEY
    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
    await new Promise((r) => setTimeout(r, 1200))

    if (method === 'stripe' && stripePk) {
      // Normally redirect to Stripe Checkout with a sessionId provided by backend
      // window.location.href = `/api/pay/stripe/checkout?amount=${Math.round(subtotal * 100)}`
      // For demo:
      setStatus('success')
    } else if (method === 'paypal' && paypalClientId) {
      // Normally render PayPal Buttons or redirect to approval URL from backend
      setStatus('success')
    } else {
      // fallback demo-only success
      setStatus('success')
    }
  }

  useEffect(() => {
    if (status === 'success') {
      dispatch({ type: 'CLEAR_CART' })
      setTimeout(() => {
        dispatch({ type: 'CLOSE_CHECKOUT' })
        setStatus('idle')
      }, 1200)
    }
  }, [status, dispatch])

  const itemSummary = useMemo(() => state.cart.items.map((i) => `${i.name} x${i.qty}`).join(', '), [state.cart.items])

  return (
    <div
      id="checkout-modal"
      role="dialog"
      aria-modal={state.ui.checkoutOpen}
      aria-labelledby="checkout-title"
      className={`fixed inset-0 z-50 ${state.ui.checkoutOpen ? '' : 'pointer-events-none'}`}
    >
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${state.ui.checkoutOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} />
      <div className={`absolute inset-0 flex items-center justify-center p-4 transition ${state.ui.checkoutOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl ring-1 ring-gray-100 grid grid-cols-1 md:grid-cols-2">
          <div className="p-5 border-b md:border-b-0 md:border-r">
            <div className="flex items-center justify-between">
              <h2 id="checkout-title" className="text-lg font-semibold">Checkout</h2>
              <button ref={closeRef} onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} className="px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400" aria-label="Close checkout dialog">✕</button>
            </div>
            <form className="mt-4 space-y-3" noValidate>
              <div>
                <label htmlFor="co-name" className="block text-sm font-medium text-gray-700">Full name</label>
                <input id="co-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
              </div>
              <div>
                <label htmlFor="co-email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
              </div>
              <div>
                <label htmlFor="co-address" className="block text-sm font-medium text-gray-700">Address</label>
                <input id="co-address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="co-city" className="block text-sm font-medium text-gray-700">City</label>
                  <input id="co-city" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
                </div>
                <div>
                  <label htmlFor="co-zip" className="block text-sm font-medium text-gray-700">ZIP / Postal</label>
                  <input id="co-zip" inputMode="numeric" pattern="\\d{4,10}" value={zip} onChange={(e) => setZip(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
                </div>
              </div>
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            </form>
          </div>
          <div className="p-5 space-y-4">
            <div className="rounded-lg bg-purple-50 p-4 text-sm">
              <p className="text-gray-700"><strong>Order summary:</strong> {itemSummary || 'No items'}</p>
            </div>
            <div className="flex items-center justify-between text-gray-900">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2"><Lock className="w-4 h-4 text-green-600"/> Secure payments powered by Stripe or PayPal</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handlePay('stripe')}
                disabled={status === 'processing' || state.cart.items.length === 0}
                className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
                aria-label="Pay with Stripe"
              >
                Pay with Stripe
              </button>
              <button
                onClick={() => handlePay('paypal')}
                disabled={status === 'processing' || state.cart.items.length === 0}
                className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-[#ffc439] text-black hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                aria-label="Pay with PayPal"
              >
                Pay with PayPal
              </button>
            </div>
            {status === 'processing' && <p className="text-sm text-gray-700" aria-live="polite">Processing your order…</p>}
            {status === 'success' && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-800" role="status" aria-live="polite">
                Payment successful! Your order is confirmed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
